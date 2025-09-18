import { useEffect, useState } from 'react'

import { formatSmartDate } from '@/utils/dateUtils'

interface LiveTimestampProps {
  dateString: string
}

/**
 * Component that displays a timestamp and automatically updates every second
 * to show live relative time (e.g., "2 minutes ago" -> "3 minutes ago")
 */
export function LiveTimestamp({ dateString }: LiveTimestampProps) {
  const [, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <span>{formatSmartDate(dateString)}</span>
}
