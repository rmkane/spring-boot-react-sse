import type { SystemEvent } from '@/types/SystemEvent';
import { EventList } from '@/components/EventList';

interface EventsSectionProps {
  events: SystemEvent[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          System Events ({events.length})
        </h2>
      </div>

      <div className="p-6">
        <EventList events={events} />
      </div>
    </div>
  );
}
