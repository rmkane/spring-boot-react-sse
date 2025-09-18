/* eslint-disable sort-keys-fix/sort-keys-fix */
/**
 * Date and time utility functions for formatting durations and relative times
 */

// Time constants in milliseconds
const MILLISECONDS_PER_SECOND = 1000
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR
const MILLISECONDS_PER_YEAR = 365 * MILLISECONDS_PER_DAY

// Time constants in seconds
const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR
const SECONDS_PER_MONTH = 30 * SECONDS_PER_DAY // Approximate

// Average time constants (for more precise calculations)
const AVERAGE_DAYS_PER_MONTH = 30.44
const AVERAGE_DAYS_PER_YEAR = 365.25

/**
 * Format a date string as a relative time (e.g., "2 minutes ago", "in 3 hours")
 * Uses native Intl.RelativeTimeFormat for zero dependencies
 */
export const formatRelativeTime = (dateString: string, locale?: string): string => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`)
  }
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  // Handle invalid or empty locale gracefully
  let rtf: Intl.RelativeTimeFormat
  try {
    rtf = new Intl.RelativeTimeFormat(locale || undefined, { numeric: 'auto' })
  } catch {
    // Fall back to default locale if the provided locale is invalid
    rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  }

  // Past dates (negative diff - date is in the past)
  if (diffInSeconds > 0) {
    if (diffInSeconds < SECONDS_PER_MINUTE) return rtf.format(-diffInSeconds, 'second')
    if (diffInSeconds < SECONDS_PER_HOUR) return rtf.format(-Math.floor(diffInSeconds / SECONDS_PER_MINUTE), 'minute')
    if (diffInSeconds < SECONDS_PER_DAY) return rtf.format(-Math.floor(diffInSeconds / SECONDS_PER_HOUR), 'hour')
    if (diffInSeconds < SECONDS_PER_MONTH) return rtf.format(-Math.floor(diffInSeconds / SECONDS_PER_DAY), 'day')
    return rtf.format(-Math.floor(diffInSeconds / SECONDS_PER_MONTH), 'month')
  }

  // Exactly now (0 seconds difference)
  if (diffInSeconds === 0) {
    return rtf.format(0, 'second')
  }

  // Future dates (positive diff - date is in the future)
  const absDiff = Math.abs(diffInSeconds)
  if (absDiff < SECONDS_PER_MINUTE) return rtf.format(absDiff, 'second')
  if (absDiff < SECONDS_PER_HOUR) return rtf.format(Math.floor(absDiff / SECONDS_PER_MINUTE), 'minute')
  if (absDiff < SECONDS_PER_DAY) return rtf.format(Math.floor(absDiff / SECONDS_PER_HOUR), 'hour')
  if (absDiff < SECONDS_PER_MONTH) return rtf.format(Math.floor(absDiff / SECONDS_PER_DAY), 'day')
  return rtf.format(Math.floor(absDiff / SECONDS_PER_MONTH), 'month')
}

/**
 * Format a duration in milliseconds as a human-readable string
 * @param durationMs Duration in milliseconds
 * @param options Formatting options
 */
export const formatDuration = (
  durationMs: number,
  options: {
    showMilliseconds?: boolean
    showZeroValues?: boolean
    maxUnits?: number
  } = {},
): string => {
  if (isNaN(durationMs) || !isFinite(durationMs)) {
    throw new Error(`Invalid duration: ${durationMs}`)
  }
  const { showMilliseconds = false, showZeroValues = false, maxUnits = showZeroValues ? 4 : 3 } = options

  const units = [
    { name: 'year', ms: MILLISECONDS_PER_YEAR },
    { name: 'day', ms: MILLISECONDS_PER_DAY },
    { name: 'hour', ms: MILLISECONDS_PER_HOUR },
    { name: 'minute', ms: MILLISECONDS_PER_MINUTE },
    { name: 'second', ms: MILLISECONDS_PER_SECOND },
    { name: 'millisecond', ms: 1 },
  ]

  const parts: string[] = []
  let remaining = Math.abs(durationMs)

  // Calculate values for each unit
  const values: { [key: string]: number } = {}
  for (const unit of units) {
    values[unit.name] = Math.floor(remaining / unit.ms)
    remaining = remaining % unit.ms
  }

  // Add values in order: year, day, hour, minute, second, millisecond
  const orderedUnits = ['year', 'day', 'hour', 'minute', 'second', 'millisecond']
  for (const unitName of orderedUnits) {
    if (values[unitName] > 0) {
      parts.push(`${values[unitName]} ${unitName}${values[unitName] !== 1 ? 's' : ''}`)
    } else if (showZeroValues && unitName !== 'millisecond' && unitName !== 'year') {
      parts.push(`0 ${unitName}s`)
    }
  }

  // Limit the number of units shown
  const limitedParts = parts.slice(0, maxUnits)

  if (limitedParts.length === 0) {
    return showMilliseconds ? '0 milliseconds' : '0 seconds'
  }

  return limitedParts.join(', ')
}

/**
 * Format a date as a compact duration (e.g., "2m 30s", "1h 15m")
 * @param dateString ISO date string
 * @param options Formatting options
 */
export const formatCompactDuration = (
  dateString: string,
  options: {
    showSeconds?: boolean
    showZeroMinutes?: boolean
  } = {},
): string => {
  const { showSeconds = true, showZeroMinutes = false } = options

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = Math.abs(now.getTime() - date.getTime())

  const hours = Math.floor(diffMs / MILLISECONDS_PER_HOUR)
  const minutes = Math.floor((diffMs % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE)
  const seconds = Math.floor((diffMs % MILLISECONDS_PER_MINUTE) / MILLISECONDS_PER_SECOND)

  const parts: string[] = []

  if (hours > 0) {
    parts.push(`${hours}h`)
  }

  if (minutes > 0 || (showZeroMinutes && hours > 0) || (showZeroMinutes && hours === 0 && minutes === 0)) {
    parts.push(`${minutes}m`)
  }

  if (
    showSeconds &&
    (seconds > 0 ||
      parts.length === 0 ||
      (hours > 0 && minutes === 0) ||
      (hours > 0 && minutes > 0) ||
      (minutes > 0 && seconds === 0))
  ) {
    parts.push(`${seconds}s`)
  }

  return parts.join(' ') || '0s'
}

/**
 * Format a date as a precise duration with milliseconds
 * @param dateString ISO date string
 */
export const formatPreciseDuration = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = Math.abs(now.getTime() - date.getTime())

  return formatDuration(diffMs, { showMilliseconds: true, maxUnits: 4 })
}

/**
 * Get the age of a date in a specific unit
 * @param dateString ISO date string
 * @param unit The unit to return the age in
 */
export const getAgeInUnit = (
  dateString: string,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years',
): number => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = Math.abs(now.getTime() - date.getTime())

  switch (unit) {
    case 'seconds':
      return Math.floor(diffMs / MILLISECONDS_PER_SECOND)
    case 'minutes':
      return Math.floor(diffMs / MILLISECONDS_PER_MINUTE)
    case 'hours':
      return Math.floor(diffMs / MILLISECONDS_PER_HOUR)
    case 'days':
      return Math.floor(diffMs / MILLISECONDS_PER_DAY)
    case 'months':
      return Math.floor(diffMs / (MILLISECONDS_PER_DAY * AVERAGE_DAYS_PER_MONTH))
    case 'years':
      return Math.floor(diffMs / (MILLISECONDS_PER_DAY * AVERAGE_DAYS_PER_YEAR))
    default:
      return 0
  }
}

/**
 * Check if a date is recent (within the last N minutes)
 * @param dateString ISO date string
 * @param minutes Number of minutes to consider "recent"
 */
export const isRecent = (dateString: string, minutes: number = 15): boolean => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = diffMs / MILLISECONDS_PER_MINUTE

  return diffMinutes <= minutes && diffMinutes >= 0
}

/**
 * Format a date for display with fallback to relative time for recent dates
 * @param dateString ISO date string
 * @param options Formatting options
 */
export const formatSmartDate = (
  dateString: string,
  options: {
    recentThresholdMinutes?: number
    showTime?: boolean
    locale?: string
  } = {},
): string => {
  const { recentThresholdMinutes = 60, showTime = true, locale } = options

  const date = new Date(dateString)
  const now = new Date()
  const diffMinutes = (now.getTime() - date.getTime()) / MILLISECONDS_PER_MINUTE

  // Use relative time for recent dates
  if (diffMinutes <= recentThresholdMinutes && diffMinutes >= 0) {
    return formatRelativeTime(dateString, locale)
  }

  // Use formatted date for older dates
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  if (showTime) {
    dateFormatOptions.hour = '2-digit'
    dateFormatOptions.minute = '2-digit'
  }

  return date.toLocaleDateString(locale, dateFormatOptions)
}
