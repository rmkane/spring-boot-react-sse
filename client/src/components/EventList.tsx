import type { SystemEvent } from '@/types/SystemEvent'
import { EventCard } from '@/components/EventCard'

interface EventListProps {
  events: SystemEvent[]
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return <div className="py-8 text-center text-gray-500">Loading events...</div>
  }

  // Sort events by updatedAt in descending order (most recent first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
