import { useEffect, useState } from 'react'

import type { SystemEvent } from '@/types/SystemEvent'
import { Severity } from '@/models/Severity'
import { LiveTimestamp } from '@/components/LiveTimestamp'

interface EventCardProps {
  event: SystemEvent
  isNew?: boolean
  locale?: string
}

const FIFTEEN_SECONDS = 15 * 1000

export function EventCard({ event, isNew = false, locale }: EventCardProps) {
  const [isHighlighted, setIsHighlighted] = useState(false)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case Severity.CRITICAL:
        return '🚨'
      case Severity.WARNING:
        return '⚠️'
      case Severity.INFO:
        return 'ℹ️'
      default:
        return '📋'
    }
  }

  const getCardStyling = () => {
    if (!event.active) {
      return 'border-red-400 bg-red-50 shadow-md ring-2 ring-red-200 dark:border-red-500 dark:bg-red-900/20 dark:ring-red-800'
    }
    if (!isHighlighted) {
      return 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
    }
    if (isNew) {
      return 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:ring-blue-800'
    }
    return 'border-yellow-400 bg-yellow-50 shadow-md ring-2 ring-yellow-200 dark:border-yellow-500 dark:bg-yellow-900/20 dark:ring-yellow-800'
  }

  const getSeverityBadgeStyling = () => {
    switch (event.severity) {
      case Severity.CRITICAL:
        return 'bg-red-500'
      case Severity.WARNING:
        return 'bg-yellow-500'
      case Severity.INFO:
      default:
        return 'bg-green-500'
    }
  }

  const renderStatusBadges = () => {
    const badges = []

    // Inactive status badge
    if (!event.active) {
      badges.push(
        <span
          key="status"
          className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          Inactive
        </span>,
      )
    }

    // NEW/UPDATED badge for active highlighted events
    if (event.active && isHighlighted) {
      const backgroundColor = isNew ? 'bg-blue-500' : 'bg-yellow-500'

      badges.push(
        <span
          key="highlight"
          className={`animate-pulse rounded-full px-2 py-1 text-xs font-medium text-white ${backgroundColor}`}
        >
          {isNew ? 'NEW' : 'UPDATED'}
        </span>,
      )
    }

    return badges
  }

  // Set up a timer to check highlighting every second
  useEffect(() => {
    const isRecentlyUpdated = () => {
      const updatedTime = new Date(event.updatedAt)
      const fifteenSecondsAgo = new Date(Date.now() - FIFTEEN_SECONDS)
      return updatedTime > fifteenSecondsAgo
    }

    const checkHighlighting = () => {
      setIsHighlighted(isRecentlyUpdated())
    }

    // Check immediately
    checkHighlighting()

    // Set up interval to check every second
    const interval = setInterval(checkHighlighting, 1000)

    return () => clearInterval(interval)
  }, [event.updatedAt])

  return (
    <div className={`event-card rounded-lg border p-4 ${getCardStyling()}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getSeverityIcon(event.severity)}</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">{event.name}</h3>
          <span className={`rounded-full px-2 py-1 text-xs font-medium text-white ${getSeverityBadgeStyling()}`}>
            {event.severity}
          </span>
          {renderStatusBadges()}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <LiveTimestamp dateString={event.updatedAt} locale={locale} />
        </div>
      </div>

      <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{event.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-blue-600 dark:text-blue-400">Count: {event.count}</span>
          <span>
            Created: <LiveTimestamp dateString={event.createdAt} locale={locale} />
          </span>
        </div>

        <div className="mt-2 font-mono text-xs text-gray-400 dark:text-gray-500">ID: {event.id}</div>
      </div>
    </div>
  )
}
