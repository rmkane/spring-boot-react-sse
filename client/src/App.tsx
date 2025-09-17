import { Header } from '@/components/Header';
import { StatusIndicator } from '@/components/StatusIndicator';
import { EventsSection } from '@/components/EventsSection';
import { useEventSSE } from '@/hooks/useEventSSE';

function App() {
  const { data: events, isConnected, lastUpdate } = useEventSSE();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Header />
        <StatusIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
        <EventsSection events={events} />
      </div>
    </div>
  );
}

export default App;
