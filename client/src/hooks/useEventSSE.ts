import { useEffect, useRef, useState } from 'react'

import type { SseEvent } from '@/types/SseEvent'
import type { SystemEvent } from '@/types/SystemEvent'
import { useGenericSSE } from '@/hooks/useGenericSSE'
import { Operation } from '@/models/Operation'

export function useEventSSE() {
  const [events, setEvents] = useState<SystemEvent[]>([])
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())
  const deletionTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Clean up timeouts on unmount
  useEffect(() => {
    const timeouts = deletionTimeoutsRef.current
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const handleEventChange = (sseEvent: unknown, currentEvents: SystemEvent[]) => {
    const event = sseEvent as SseEvent
    switch (event.operation) {
      case Operation.CREATE:
        console.log('Created event:', event.event.name)
        // Mark this event as new
        setNewEventIds((prev) => new Set(prev).add(event.event.id))
        return [event.event, ...currentEvents]

      case Operation.UPDATE:
        console.log('Updated event:', event.event.name)
        return currentEvents.map((e) => (e.id === event.event.id ? event.event : e))

      case Operation.DELETE: {
        console.log('Deleted event:', event.event.name, 'ID:', event.event.id)
        // Server marks event as inactive, show deletion animation for 3 seconds
        const updatedEvents = currentEvents.map((e) => (e.id === event.event.id ? event.event : e))

        // Set timeout to remove the event after 3 seconds
        const timeout = setTimeout(() => {
          console.log(`Timeout fired for event ${event.event.name}, removing from UI`)
          setEvents((prevEvents) => {
            const filtered = prevEvents.filter((e) => e.id !== event.event.id)
            console.log(`Removed event ${event.event.name} from UI after deletion animation`)
            return filtered
          })
          deletionTimeoutsRef.current.delete(event.event.id)
        }, 3000)

        deletionTimeoutsRef.current.set(event.event.id, timeout)

        // Immediately update local state to show deletion animation
        setEvents(updatedEvents)

        return updatedEvents
      }

      default:
        return currentEvents
    }
  }

  const sseResult = useGenericSSE({
    eventHandlers: {
      'event-change': handleEventChange,
      'initial-events': (data: unknown) => {
        const events = data as SystemEvent[]
        console.log('Received initial events:', events.length)
        console.log('Initial event names:', events.map((e) => e.name).join(', '))
        return events
      },
    },
    initialData: [] as SystemEvent[],
    onConnect: () => console.log('SSE connection opened'),
    onError: (error) => console.error('SSE connection error:', error),
    url: 'http://localhost:8080/api/events/stream',
  })

  // Sync SSE data with local state, but respect deletion state
  useEffect(() => {
    setEvents((prevEvents) => {
      // Filter out events that are currently being deleted
      const filteredSSEData = sseResult.data.filter((event) => !deletionTimeoutsRef.current.has(event.id))

      // Merge with existing events, keeping deletion state
      const mergedEvents = [...filteredSSEData]

      // Add back events that are being deleted (for animation)
      prevEvents.forEach((event) => {
        if (deletionTimeoutsRef.current.has(event.id)) {
          mergedEvents.push(event)
        }
      })

      return mergedEvents
    })
  }, [sseResult.data])

  // Debug: Log the final event count
  console.log(`Total events received: ${sseResult.data.length}`)
  console.log(`Events displayed: ${events.length}`)
  console.log(
    `Active events: ${events
      .filter((e) => e.active)
      .map((e) => e.name)
      .join(', ')}`,
  )
  console.log(
    `Inactive events (deleting): ${events
      .filter((e) => !e.active)
      .map((e) => e.name)
      .join(', ')}`,
  )

  return {
    ...sseResult,
    data: events,
    newEventIds,
  }
}
