import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatRelativeTime } from '../dateUtils'

describe('dateUtils - Locale Support', () => {
  beforeEach(() => {
    // Mock the current time to ensure consistent test results
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('English (en)', () => {
    it('should format in English', () => {
      const recentTime = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(recentTime, 'en')).toBe('2 minutes ago')
    })

    it('should format seconds in English', () => {
      const recentTime = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(recentTime, 'en')).toBe('30 seconds ago')
    })

    it('should format hours in English', () => {
      const recentTime = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(recentTime, 'en')).toBe('3 hours ago')
    })

    it('should format future times in English', () => {
      const futureTime = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(futureTime, 'en')).toBe('in 5 minutes')
    })
  })

  describe('French (fr)', () => {
    it('should format in French', () => {
      const recentTime = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(recentTime, 'fr')).toBe('il y a 2 minutes')
    })

    it('should format seconds in French', () => {
      const recentTime = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(recentTime, 'fr')).toBe('il y a 30 secondes')
    })

    it('should format hours in French', () => {
      const recentTime = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(recentTime, 'fr')).toBe('il y a 3 heures')
    })

    it('should format future times in French', () => {
      const futureTime = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(futureTime, 'fr')).toBe('dans 5 minutes')
    })
  })

  describe('German (de)', () => {
    it('should format in German', () => {
      const recentTime = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(recentTime, 'de')).toBe('vor 2 Minuten')
    })

    it('should format seconds in German', () => {
      const recentTime = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(recentTime, 'de')).toBe('vor 30 Sekunden')
    })

    it('should format hours in German', () => {
      const recentTime = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(recentTime, 'de')).toBe('vor 3 Stunden')
    })

    it('should format future times in German', () => {
      const futureTime = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(futureTime, 'de')).toBe('in 5 Minuten')
    })
  })

  describe('Default locale behavior', () => {
    it('should use browser default when no locale specified', () => {
      const recentTime = '2024-01-15T11:58:00Z' // 2 minutes ago
      const result = formatRelativeTime(recentTime)
      // This will depend on the test environment's locale
      expect(result).toMatch(/2.*minute/)
    })
  })

  describe('Edge cases', () => {
    it('should handle invalid locale gracefully', () => {
      const recentTime = '2024-01-15T11:58:00Z'
      // Invalid locale should fall back to default behavior
      expect(() => formatRelativeTime(recentTime, 'invalid-locale')).not.toThrow()
    })

    it('should handle empty locale string', () => {
      const recentTime = '2024-01-15T11:58:00Z'
      expect(() => formatRelativeTime(recentTime, '')).not.toThrow()
      // Should fall back to default locale
      const result = formatRelativeTime(recentTime, '')
      expect(result).toMatch(/2.*minute/)
    })
  })
})
