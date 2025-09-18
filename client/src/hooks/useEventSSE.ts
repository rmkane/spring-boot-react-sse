import { useEffect, useState } from 'react'

import type { SseEvent } from '@/types/SseEvent'
import type { SystemEvent } from '@/types/SystemEvent'
import { logSSE } from '@/utils/logger'
import { useGenericSSE } from '@/hooks/useGenericSSE'
import { Operation } from '@/models/Operation'

export function useEventSSE() {
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())

  const handleEventChange = (sseEvent: unknown, currentEvents: SystemEvent[]) => {
    const { operation, event: systemEvent } = sseEvent as SseEvent

    switch (operation) {
      case Operation.CREATE:
        logSSE(operation, systemEvent.name, systemEvent.id)
        // Mark this event as new
        setNewEventIds((prev) => new Set(prev).add(systemEvent.id))
        return [systemEvent, ...currentEvents]

      case Operation.UPDATE:
        logSSE(operation, systemEvent.name, systemEvent.id)
        return currentEvents.map((e) => (e.id === systemEvent.id ? systemEvent : e))

      case Operation.DELETE:
        logSSE(operation, systemEvent.name, systemEvent.id)
        // Mark the event as inactive instead of removing it
        return currentEvents.map((e) => (e.id === systemEvent.id ? { ...systemEvent, active: false } : e))

      default:
        return currentEvents
    }
  }

  const sseResult = useGenericSSE({
    eventHandlers: {
      'event-change': handleEventChange,
      'initial-events': (data: unknown) => {
        const events = data as SystemEvent[]
        const activeCount = events.filter((e) => e.active).length
        const inactiveCount = events.filter((e) => !e.active).length
        logSSE(
          'INITIAL',
          `Received ${events.length} events (${activeCount} active, ${inactiveCount} inactive)`,
          'initial-load',
        )
        return events
      },
    },
    initialData: [] as SystemEvent[],
    onConnect: () => logSSE('CONNECT', 'SSE connection opened', 'connection'),
    onError: (error) => {
      const errorMessage =
        error.type === 'error' ? 'Connection failed or server unavailable' : `Event error: ${error.type}`
      logSSE('ERROR', `SSE connection error: ${errorMessage}`, 'connection')
    },
    url: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api/events/stream` // Docker dev: localhost:8080
      : 'http://localhost:8080/api/events/stream', // Local dev: localhost:8080
  })

  // Sort events: active first (by latest updated), then inactive (by latest updated)
  const sortedEvents = sseResult.data.sort((a, b) => {
    // First, sort by active status (active events first)
    if (a.active !== b.active) {
      return a.active ? -1 : 1
    }
    // Then sort by updatedAt (latest first)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  // Debug logging for event count changes
  useEffect(() => {
    const activeCount = sortedEvents.filter((e) => e.active).length
    const inactiveCount = sortedEvents.filter((e) => !e.active).length
    logSSE('COUNT', `Total: ${sortedEvents.length} (${activeCount} active, ${inactiveCount} inactive)`, 'state')
  }, [sortedEvents])

  return {
    ...sseResult,
    data: sortedEvents,
    newEventIds,
  }
}
