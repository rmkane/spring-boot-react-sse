import { useState, useEffect } from 'react';

import type { SystemEvent } from '@/types/SystemEvent';
import type { SseEvent } from '@/types/SseEvent';

import { Operation } from '@/models/Operation';

export function useSSE() {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/api/events/stream');

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('SSE connection opened');
    };

    eventSource.addEventListener('initial-events', (event) => {
      try {
        const data: SystemEvent[] = JSON.parse(event.data);
        setEvents(data);
        setLastUpdate(new Date().toLocaleTimeString());
        console.log('Initial events loaded:', data.length);
      } catch (error) {
        console.error('Error parsing initial events:', error);
      }
    });

    eventSource.addEventListener('event-change', (event) => {
      try {
        const sseEvent: SseEvent = JSON.parse(event.data);
        setEvents(prevEvents => {
          switch (sseEvent.operation) {
            case Operation.CREATE:
              console.log('Created event:', sseEvent.event.name);
              return [sseEvent.event, ...prevEvents];

            case Operation.UPDATE:
              console.log('Updated event:', sseEvent.event.name);
              return prevEvents.map(e =>
                e.id === sseEvent.event.id ? sseEvent.event : e
              );

            case Operation.DELETE:
              console.log('Deleted event:', sseEvent.event.name);
              return prevEvents.filter(e => e.id !== sseEvent.event.id);

            default:
              return prevEvents;
          }
        });
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error parsing event change:', error);
      }
    });

    eventSource.onerror = (error) => {
      setIsConnected(false);
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  return { events, isConnected, lastUpdate };
}
