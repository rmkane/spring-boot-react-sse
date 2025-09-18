import { useEventSSE } from '@/hooks/useEventSSE'
import { EventsSection } from '@/components/EventsSection'
import { Header } from '@/components/Header'
import { StatusIndicator } from '@/components/StatusIndicator'

function App() {
  const { data: events, isConnected, lastUpdate, newEventIds } = useEventSSE()

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        <Header />
        <StatusIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
        <EventsSection events={events} newEventIds={newEventIds} />
      </div>
    </div>
  )
}

export default App
