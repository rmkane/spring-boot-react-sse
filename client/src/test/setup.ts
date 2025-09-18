/**
 * Test setup file for Vitest
 * This file runs before all tests
 */

import { beforeEach } from 'vitest'

// Mock console methods to reduce noise in tests
const originalConsole = { ...console }

beforeEach(() => {
  // Restore console for each test
  Object.assign(console, originalConsole)
})

// Global test utilities can be added here
