import { useEffect, useState } from 'react'

import type { SystemEvent } from '@/types/SystemEvent'
import { Severity } from '@/models/Severity'

interface EventCardProps {
  event: SystemEvent
  isNew?: boolean
}

const FIFTEEN_SECONDS = 15 * 1000

export function EventCard({ event, isNew = false }: EventCardProps) {
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
      return 'border-red-400 bg-red-50 shadow-md ring-2 ring-red-200'
    }
    if (isHighlighted) {
      return 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200'
    }
    return 'border-gray-200 bg-white'
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

    // Active/Inactive status badge
    badges.push(
      <span
        key="status"
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          event.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {event.active ? 'Active' : 'Inactive'}
      </span>,
    )

    // DELETED badge for inactive events
    if (!event.active) {
      badges.push(
        <span key="deleted" className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
          DELETED
        </span>,
      )
    }

    // NEW/UPDATED badge for active highlighted events
    if (event.active && isHighlighted) {
      badges.push(
        <span
          key="highlight"
          className="animate-pulse rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white"
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
          <h3 className="font-semibold text-gray-900">{event.name}</h3>
          <span className={`rounded-full px-2 py-1 text-xs font-medium text-white ${getSeverityBadgeStyling()}`}>
            {event.severity}
          </span>
          {renderStatusBadges()}
        </div>
        <div className="text-sm text-gray-500">{new Date(event.updatedAt).toLocaleString()}</div>
      </div>

      <p className="mb-3 text-sm text-gray-600">{event.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="font-medium text-blue-600">Count: {event.count}</span>
          <span>Created: {new Date(event.createdAt).toLocaleString()}</span>
        </div>

        <div className="mt-2 font-mono text-xs text-gray-400">ID: {event.id}</div>
      </div>
    </div>
  )
}
