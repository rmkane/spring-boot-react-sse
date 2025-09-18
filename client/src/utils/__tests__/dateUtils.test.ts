import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  formatCompactDuration,
  formatDuration,
  formatPreciseDuration,
  formatRelativeTime,
  formatSmartDate,
  getAgeInUnit,
  isRecent,
} from '../dateUtils'

describe('dateUtils', () => {
  beforeEach(() => {
    // Mock the current time to ensure consistent test results
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatRelativeTime', () => {
    it('should format recent past times correctly', () => {
      const recentTime = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(recentTime)).toBe('2 minutes ago')
    })

    it('should format seconds ago', () => {
      const recentTime = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(recentTime)).toBe('30 seconds ago')
    })

    it('should format hours ago', () => {
      const recentTime = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(recentTime)).toBe('3 hours ago')
    })

    it('should format days ago', () => {
      const recentTime = '2024-01-13T12:00:00Z' // 2 days ago
      expect(formatRelativeTime(recentTime)).toBe('2 days ago')
    })

    it('should format future times correctly', () => {
      const futureTime = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(futureTime)).toBe('in 5 minutes')
    })

    it('should handle edge case of exactly now', () => {
      const now = '2024-01-15T12:00:00Z'
      expect(formatRelativeTime(now)).toBe('now')
    })

    it('should handle UTC timestamps without Z suffix', () => {
      const utcTime = '2024-01-15T11:58:00' // No Z suffix
      const utcTimeWithZ = '2024-01-15T11:58:00Z' // With Z suffix
      const result1 = formatRelativeTime(utcTime)
      const result2 = formatRelativeTime(utcTimeWithZ)
      expect(result1).toBe(result2) // Should produce same result
      expect(result1).toMatch(/2.*minute/)
    })
  })

  describe('formatDuration', () => {
    it('should format milliseconds correctly', () => {
      expect(formatDuration(1000)).toBe('1 second')
      expect(formatDuration(2000)).toBe('2 seconds')
      expect(formatDuration(60000)).toBe('1 minute')
      expect(formatDuration(125000)).toBe('2 minutes, 5 seconds')
    })

    it('should format with milliseconds when requested', () => {
      expect(formatDuration(1250, { showMilliseconds: true })).toBe('1 second, 250 milliseconds')
    })

    it('should limit units when maxUnits is specified', () => {
      const longDuration = 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000 // 2d 3h 45m 30s
      expect(formatDuration(longDuration, { maxUnits: 2 })).toBe('2 days, 3 hours')
    })

    it('should show zero values when requested', () => {
      expect(formatDuration(60000, { showZeroValues: true })).toBe('0 days, 0 hours, 1 minute, 0 seconds')
    })

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0 seconds')
      expect(formatDuration(0, { showMilliseconds: true })).toBe('0 milliseconds')
    })
  })

  describe('formatCompactDuration', () => {
    it('should format compact durations correctly', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatCompactDuration(time)).toBe('2m 0s')
    })

    it('should hide seconds when showSeconds is false', () => {
      const time = '2024-01-15T11:58:30Z' // 1m 30s ago
      expect(formatCompactDuration(time, { showSeconds: false })).toBe('1m')
    })

    it('should show zero minutes when showZeroMinutes is true', () => {
      const time = '2024-01-15T11:59:30Z' // 30s ago
      expect(formatCompactDuration(time, { showZeroMinutes: true })).toBe('0m 30s')
    })

    it('should handle hours correctly', () => {
      const time = '2024-01-15T09:30:00Z' // 2h 30m ago
      expect(formatCompactDuration(time)).toBe('2h 30m 0s')
    })
  })

  describe('formatPreciseDuration', () => {
    it('should include milliseconds in precise duration', () => {
      const time = '2024-01-15T11:59:59.500Z' // 500ms ago
      const result = formatPreciseDuration(time)
      expect(result).toContain('milliseconds')
    })
  })

  describe('getAgeInUnit', () => {
    it('should return correct age in seconds', () => {
      const time = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(getAgeInUnit(time, 'seconds')).toBe(30)
    })

    it('should return correct age in minutes', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(getAgeInUnit(time, 'minutes')).toBe(2)
    })

    it('should return correct age in hours', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(getAgeInUnit(time, 'hours')).toBe(3)
    })

    it('should return correct age in days', () => {
      const time = '2024-01-13T12:00:00Z' // 2 days ago
      expect(getAgeInUnit(time, 'days')).toBe(2)
    })
  })

  describe('isRecent', () => {
    it('should return true for recent times', () => {
      const recentTime = '2024-01-15T11:59:50Z' // 10 seconds ago
      expect(isRecent(recentTime, 15)).toBe(true)
    })

    it('should return false for old times', () => {
      const oldTime = '2024-01-15T11:30:00Z' // 30 minutes ago
      expect(isRecent(oldTime, 15)).toBe(false)
    })

    it('should return false for future times', () => {
      const futureTime = '2024-01-15T12:00:05Z' // 5 seconds in future
      expect(isRecent(futureTime, 15)).toBe(false)
    })

    it('should use default threshold of 300 seconds (5 minutes)', () => {
      const recentTime = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(isRecent(recentTime)).toBe(true)

      const oldTime = '2024-01-15T11:50:00Z' // 10 minutes ago
      expect(isRecent(oldTime)).toBe(false)
    })
  })

  describe('formatSmartDate', () => {
    it('should use relative time for recent dates', () => {
      const recentTime = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatSmartDate(recentTime)).toBe('2 minutes ago')
    })

    it('should use formatted date for old dates', () => {
      const oldTime = '2024-01-10T12:00:00Z' // 5 days ago
      const result = formatSmartDate(oldTime)
      expect(result).toMatch(/Jan 10, 2024/)
    })

    it('should respect recentThresholdMinutes option', () => {
      const time = '2024-01-15T11:30:00Z' // 30 minutes ago
      expect(formatSmartDate(time, { recentThresholdMinutes: 60 })).toBe('30 minutes ago')
      expect(formatSmartDate(time, { recentThresholdMinutes: 15 })).toMatch(/Jan 15, 2024/)
    })

    it('should hide time when showTime is false', () => {
      const oldTime = '2024-01-10T12:00:00Z'
      const result = formatSmartDate(oldTime, { showTime: false })
      expect(result).not.toMatch(/12:00/)
    })
  })

  describe('edge cases', () => {
    it('should handle invalid date strings gracefully', () => {
      expect(() => formatRelativeTime('invalid-date')).toThrow()
      expect(() => formatDuration(NaN)).toThrow()
    })

    it('should handle very large durations', () => {
      const veryLongDuration = 365 * 24 * 60 * 60 * 1000 // 1 year
      const result = formatDuration(veryLongDuration)
      expect(result).toContain('year')
    })

    it('should handle very small durations', () => {
      expect(formatDuration(1)).toBe('1 millisecond')
      expect(formatDuration(500)).toBe('500 milliseconds')
    })
  })
})
