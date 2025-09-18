import type { SystemEvent } from '@/types/SystemEvent'
import { EventCard } from '@/components/EventCard'

interface EventListProps {
  events: SystemEvent[]
  newEventIds: Set<string>
  locale?: string
}

export function EventList({ events, newEventIds, locale }: EventListProps) {
  if (events.length === 0) {
    return <div className="py-8 text-center text-gray-500">Loading events...</div>
  }

  // Events are already sorted by updatedAt in descending order (most recent first) in useEventSSE
  return (
    <div className="event-list space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} isNew={newEventIds.has(event.id)} locale={locale} />
      ))}
    </div>
  )
}
