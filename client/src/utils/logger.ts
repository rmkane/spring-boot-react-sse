/* eslint-disable sort-keys-fix/sort-keys-fix */
type LogLevel = 'info' | 'warn' | 'error' | 'debug'
type LogCategory = 'sse' | 'ui' | 'api' | 'state' | 'performance'

interface LogConfig {
  level: LogLevel
  category: LogCategory
  message: string
  data?: unknown
  timestamp?: boolean
}

const colors = {
  // Log levels
  info: '#3b82f6', // blue
  warn: '#f59e0b', // amber
  error: '#ef4444', // red
  debug: '#8b5cf6', // purple

  // Categories
  sse: '#10b981', // emerald
  ui: '#f97316', // orange
  api: '#06b6d4', // cyan
  state: '#8b5cf6', // purple
  performance: '#ec4899', // pink

  // Operations
  create: '#10b981', // bright green
  update: '#3b82f6', // bright blue
  delete: '#ef4444', // bright red

  // Text colors for dark theme
  timestamp: '#d1d5db',
  text: '#e5e7eb',
  highlight: '#f9fafb',
  muted: '#9ca3af',
} as const

const icons = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🐛',
  sse: '📡',
  ui: '🎨',
  api: '🌐',
  state: '🔄',
  performance: '⚡',
} as const

class Logger {
  private isEnabled = true
  private showTimestamp = true
  private showIcons = true

  constructor(options?: { enabled?: boolean; timestamp?: boolean; icons?: boolean }) {
    this.isEnabled = options?.enabled ?? true
    this.showTimestamp = options?.timestamp ?? true
    this.showIcons = options?.icons ?? true
  }

  private formatMessage(config: LogConfig): void {
    if (!this.isEnabled) return

    const timestamp = this.showTimestamp ? new Date().toLocaleTimeString() : ''
    const icon = this.showIcons ? icons[config.category] : ''
    const levelIcon = this.showIcons ? icons[config.level] : ''

    const parts: string[] = []
    const styles: string[] = []

    // Timestamp
    if (timestamp) {
      parts.push(`%c[${timestamp}]`)
      styles.push(`color: ${colors.timestamp}`)
    }

    // Category icon and name
    if (icon) {
      parts.push(`%c${icon} %c${config.category.toUpperCase()}`)
      styles.push('', `color: ${colors[config.category]}; font-weight: bold`)
    }

    // Level icon and name
    if (levelIcon) {
      parts.push(`%c${levelIcon} %c${config.level.toUpperCase()}`)
      styles.push('', `color: ${colors[config.level]}; font-weight: bold`)
    }

    // Message
    parts.push(`%c${config.message}`)
    styles.push(`color: ${colors.text}`)

    // Data (if provided)
    if (config.data !== undefined) {
      parts.push(`%c${JSON.stringify(config.data, null, 2)}`)
      styles.push(`color: ${colors.muted}; font-family: monospace`)
    }

    console.log(parts.join(' '), ...styles)
  }

  // Convenience methods for each log level
  info(category: LogCategory, message: string, data?: unknown): void {
    this.formatMessage({ level: 'info', category, message, data })
  }

  warn(category: LogCategory, message: string, data?: unknown): void {
    this.formatMessage({ level: 'warn', category, message, data })
  }

  error(category: LogCategory, message: string, data?: unknown): void {
    this.formatMessage({ level: 'error', category, message, data })
  }

  debug(category: LogCategory, message: string, data?: unknown): void {
    this.formatMessage({ level: 'debug', category, message, data })
  }

  // Specialized methods for common use cases
  sseEvent(operation: string, eventName: string, eventId: string, isActive: boolean): void {
    const status = isActive ? 'ACTIVE' : 'INACTIVE'
    const statusColor = isActive ? colors.create : colors.delete
    const operationColor = colors[operation.toLowerCase() as keyof typeof colors] || colors.info

    console.log(
      `%c[${new Date().toLocaleTimeString()}] %c📡 %cSSE %c${operation} %cevent: %c${eventName} %c(${status}) %cID: ${eventId}`,
      `color: ${colors.timestamp}`,
      '',
      `color: ${colors.sse}; font-weight: bold`,
      `color: ${operationColor}; font-weight: bold`,
      `color: ${colors.text}`,
      `color: ${colors.highlight}`,
      `color: ${statusColor}; font-weight: bold`,
      `color: ${colors.muted}`,
    )
  }

  performance(action: string, duration: number, details?: string): void {
    const durationColor = duration > 1000 ? colors.error : duration > 500 ? colors.warn : colors.info

    console.log(
      `%c[${new Date().toLocaleTimeString()}] %c⚡ %cPERFORMANCE %c${action} %c${duration}ms${details ? ` %c${details}` : ''}`,
      `color: ${colors.timestamp}`,
      '',
      `color: ${colors.performance}; font-weight: bold`,
      `color: ${colors.text}`,
      `color: ${durationColor}; font-weight: bold`,
      details ? `color: ${colors.muted}` : '',
    )
  }

  // Configuration methods
  enable(): void {
    this.isEnabled = true
  }

  disable(): void {
    this.isEnabled = false
  }

  setTimestamp(enabled: boolean): void {
    this.showTimestamp = enabled
  }

  setIcons(enabled: boolean): void {
    this.showIcons = enabled
  }
}

// Create and export a default logger instance
export const logger = new Logger()

// Export the Logger class for custom instances
export { Logger }

// Convenience exports for common logging patterns
export const logSSE = (operation: string, eventName: string, eventId: string, isActive: boolean) =>
  logger.sseEvent(operation, eventName, eventId, isActive)

export const logPerformance = (action: string, duration: number, details?: string) =>
  logger.performance(action, duration, details)
