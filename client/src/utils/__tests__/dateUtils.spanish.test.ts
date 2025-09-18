import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatRelativeTime } from '../dateUtils'

describe('dateUtils - Spanish Locale Variations', () => {
  beforeEach(() => {
    // Mock the current time to ensure consistent test results
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Spanish (es)', () => {
    it('should format minutes correctly', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'es')).toBe('hace 2 minutos')
    })

    it('should format singular minute correctly', () => {
      const time = '2024-01-15T11:59:00Z' // 1 minute ago
      expect(formatRelativeTime(time, 'es')).toBe('hace 1 minuto')
    })

    it('should format seconds correctly', () => {
      const time = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(time, 'es')).toBe('hace 30 segundos')
    })

    it('should format singular second correctly', () => {
      const time = '2024-01-15T11:59:59Z' // 1 second ago
      expect(formatRelativeTime(time, 'es')).toBe('hace 1 segundo')
    })

    it('should format hours correctly', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(time, 'es')).toBe('hace 3 horas')
    })

    it('should format singular hour correctly', () => {
      const time = '2024-01-15T11:00:00Z' // 1 hour ago
      expect(formatRelativeTime(time, 'es')).toBe('hace 1 hora')
    })

    it('should format days correctly', () => {
      const time = '2024-01-13T12:00:00Z' // 2 days ago
      expect(formatRelativeTime(time, 'es')).toBe('anteayer')
    })

    it('should format singular day correctly', () => {
      const time = '2024-01-14T12:00:00Z' // 1 day ago
      expect(formatRelativeTime(time, 'es')).toBe('ayer')
    })

    it('should format future times correctly', () => {
      const time = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(time, 'es')).toBe('dentro de 5 minutos')
    })

    it('should format future singular correctly', () => {
      const time = '2024-01-15T12:01:00Z' // 1 minute in future
      expect(formatRelativeTime(time, 'es')).toBe('dentro de 1 minuto')
    })
  })

  describe('Spanish US (es-US)', () => {
    it('should format consistently with es-US locale', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'es-US')).toBe('hace 2 minutos')
    })

    it('should handle different time units in es-US', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(time, 'es-US')).toBe('hace 3 horas')
    })
  })

  describe('Spanish Mexico (es-MX)', () => {
    it('should format consistently with es-MX locale', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'es-MX')).toBe('hace 2 minutos')
    })
  })

  describe('Spanish Argentina (es-AR)', () => {
    it('should format consistently with es-AR locale', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'es-AR')).toBe('hace 2 minutos')
    })
  })

  describe('Edge cases for Spanish', () => {
    it('should handle exactly now', () => {
      const now = '2024-01-15T12:00:00Z'
      expect(formatRelativeTime(now, 'es')).toBe('ahora')
    })

    it('should handle very recent times', () => {
      const time = '2024-01-15T11:59:59.500Z' // 500ms ago
      expect(formatRelativeTime(time, 'es')).toBe('ahora')
    })

    it('should handle very old times', () => {
      const time = '2024-01-01T12:00:00Z' // 14 days ago
      expect(formatRelativeTime(time, 'es')).toBe('hace 14 días')
    })
  })
})
