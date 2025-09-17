import { useGenericSSE } from './useGenericSSE';
import type { SystemEvent } from '@/types/SystemEvent';
import type { SseEvent } from '@/types/SseEvent';
import { Operation } from '@/models/Operation';

export function useEventSSE() {
  return useGenericSSE({
    url: 'http://localhost:8080/api/events/stream',
    initialData: [] as SystemEvent[],
    eventHandlers: {
      'initial-events': (data: unknown) => data as SystemEvent[],
      'event-change': (sseEvent: unknown, currentEvents: SystemEvent[]) => {
        const event = sseEvent as SseEvent;
        switch (event.operation) {
          case Operation.CREATE:
            console.log('Created event:', event.event.name);
            return [event.event, ...currentEvents];

          case Operation.UPDATE:
            console.log('Updated event:', event.event.name);
            return currentEvents.map(e =>
              e.id === event.event.id ? event.event : e
            );

          case Operation.DELETE:
            console.log('Deleted event:', event.event.name);
            return currentEvents.filter(e => e.id !== event.event.id);

          default:
            return currentEvents;
        }
      }
    },
    onConnect: () => console.log('SSE connection opened'),
    onError: (error) => console.error('SSE connection error:', error)
  });
}
