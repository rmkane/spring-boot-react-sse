import { ThemeToggleButton } from '@/components/ThemeToggleButton'

export function Header() {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Spring Boot + React SSE Event Monitor</h1>
      <p className="text-gray-600 dark:text-gray-300">Real-time system event monitoring with Server-Sent Events</p>
      <ThemeToggleButton />
    </div>
  )
}
