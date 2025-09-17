import { useState, useEffect } from 'react';
import type { Event } from '@/types/Event';

export function useSSE() {
  const [events, setEvents] = useState<Event[]>([]);
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
        const data: Event[] = JSON.parse(event.data);
        setEvents(data);
        setLastUpdate(new Date().toLocaleTimeString());
        console.log('Initial events loaded:', data.length);
      } catch (error) {
        console.error('Error parsing initial events:', error);
      }
    });

    eventSource.addEventListener('events-update', (event) => {
      try {
        const data: Event[] = JSON.parse(event.data);
        setEvents(data);
        setLastUpdate(new Date().toLocaleTimeString());
        console.log('Events updated:', data.length);
      } catch (error) {
        console.error('Error parsing event update:', error);
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
