import { useState } from 'react'

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
        logSSE(operation, systemEvent.name, systemEvent.id, systemEvent.active)
        // Mark this event as new
        setNewEventIds((prev) => new Set(prev).add(systemEvent.id))
        return [systemEvent, ...currentEvents]

      case Operation.UPDATE:
        logSSE(operation, systemEvent.name, systemEvent.id, systemEvent.active)
        return currentEvents.map((e) => (e.id === systemEvent.id ? systemEvent : e))

      case Operation.DELETE:
        logSSE(operation, systemEvent.name, systemEvent.id, systemEvent.active)
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
        logSSE('INITIAL', `Received ${events.length} events`, 'initial-load', true)
        return events
      },
    },
    initialData: [] as SystemEvent[],
    onConnect: () => logSSE('CONNECT', 'SSE connection opened', 'connection', true),
    onError: (error) => logSSE('ERROR', `SSE connection error: ${error}`, 'connection', false),
    url: 'http://localhost:8080/api/events/stream',
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

  return {
    ...sseResult,
    data: sortedEvents,
    newEventIds,
  }
}
