import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatRelativeTime } from '../dateUtils'

describe('dateUtils - Asian Languages', () => {
  beforeEach(() => {
    // Mock the current time to ensure consistent test results
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Japanese (ja)', () => {
    it('should format minutes correctly', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'ja')).toBe('2 分前')
    })

    it('should format seconds correctly', () => {
      const time = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(time, 'ja')).toBe('30 秒前')
    })

    it('should format hours correctly', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(time, 'ja')).toBe('3 時間前')
    })

    it('should format days correctly', () => {
      const time = '2024-01-13T12:00:00Z' // 2 days ago
      expect(formatRelativeTime(time, 'ja')).toBe('一昨日')
    })

    it('should format future times correctly', () => {
      const time = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(time, 'ja')).toBe('5 分後')
    })

    it('should format future hours correctly', () => {
      const time = '2024-01-15T15:00:00Z' // 3 hours in future
      expect(formatRelativeTime(time, 'ja')).toBe('3 時間後')
    })
  })

  describe('Chinese Simplified (zh-CN)', () => {
    it('should format minutes correctly', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'zh-CN')).toBe('2分钟前')
    })

    it('should format seconds correctly', () => {
      const time = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(time, 'zh-CN')).toBe('30秒钟前')
    })

    it('should format hours correctly', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(time, 'zh-CN')).toBe('3小时前')
    })

    it('should format days correctly', () => {
      const time = '2024-01-13T12:00:00Z' // 2 days ago
      expect(formatRelativeTime(time, 'zh-CN')).toBe('前天')
    })

    it('should format future times correctly', () => {
      const time = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(time, 'zh-CN')).toBe('5分钟后')
    })
  })

  describe('Chinese Traditional (zh-TW)', () => {
    it('should format minutes correctly', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'zh-TW')).toBe('2 分鐘前')
    })

    it('should format seconds correctly', () => {
      const time = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(time, 'zh-TW')).toBe('30 秒前')
    })

    it('should format hours correctly', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(time, 'zh-TW')).toBe('3 小時前')
    })

    it('should format future times correctly', () => {
      const time = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(time, 'zh-TW')).toBe('5 分鐘後')
    })
  })

  describe('Korean (ko)', () => {
    it('should format minutes correctly', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'ko')).toBe('2분 전')
    })

    it('should format seconds correctly', () => {
      const time = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(time, 'ko')).toBe('30초 전')
    })

    it('should format hours correctly', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(time, 'ko')).toBe('3시간 전')
    })

    it('should format days correctly', () => {
      const time = '2024-01-13T12:00:00Z' // 2 days ago
      expect(formatRelativeTime(time, 'ko')).toBe('그저께')
    })

    it('should format future times correctly', () => {
      const time = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(time, 'ko')).toBe('5분 후')
    })
  })

  describe('Thai (th)', () => {
    it('should format minutes correctly', () => {
      const time = '2024-01-15T11:58:00Z' // 2 minutes ago
      expect(formatRelativeTime(time, 'th')).toBe('2 นาทีที่ผ่านมา')
    })

    it('should format seconds correctly', () => {
      const time = '2024-01-15T11:59:30Z' // 30 seconds ago
      expect(formatRelativeTime(time, 'th')).toBe('30 วินาทีที่ผ่านมา')
    })

    it('should format hours correctly', () => {
      const time = '2024-01-15T09:00:00Z' // 3 hours ago
      expect(formatRelativeTime(time, 'th')).toBe('3 ชั่วโมงที่ผ่านมา')
    })

    it('should format future times correctly', () => {
      const time = '2024-01-15T12:05:00Z' // 5 minutes in future
      expect(formatRelativeTime(time, 'th')).toBe('ในอีก 5 นาที')
    })
  })

  describe('Edge cases for Asian languages', () => {
    it('should handle exactly now in Japanese', () => {
      const now = '2024-01-15T12:00:00Z'
      expect(formatRelativeTime(now, 'ja')).toBe('今')
    })

    it('should handle exactly now in Chinese', () => {
      const now = '2024-01-15T12:00:00Z'
      expect(formatRelativeTime(now, 'zh-CN')).toBe('现在')
    })

    it('should handle exactly now in Korean', () => {
      const now = '2024-01-15T12:00:00Z'
      expect(formatRelativeTime(now, 'ko')).toBe('지금')
    })
  })
})
