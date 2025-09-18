import type { SystemEvent } from '@/types/SystemEvent'
import { EventList } from '@/components/EventList'

interface EventsSectionProps {
  events: SystemEvent[]
  newEventIds: Set<string>
  locale?: string
}

export function EventsSection({ events, newEventIds, locale }: EventsSectionProps) {
  const activeCount = events.filter((event) => event.active).length
  const inactiveCount = events.filter((event) => !event.active).length

  const renderInactiveCount = () => {
    if (inactiveCount === 0) {
      return null
    }
    return <span className="ml-2 text-red-600 dark:text-red-400">({inactiveCount} inactive)</span>
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          System Events: {activeCount}
          {renderInactiveCount()}
        </h2>
      </div>

      <div className="p-6">
        <EventList events={events} newEventIds={newEventIds} locale={locale} />
      </div>
    </div>
  )
}
