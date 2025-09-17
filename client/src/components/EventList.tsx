import type { Event } from '@/types/Event';
import { EventCard } from '@/components/EventCard';

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading events...
      </div>
    );
  }

  // Sort events by updatedAt in descending order (most recent first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
