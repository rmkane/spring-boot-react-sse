import { useTheme } from '@/hooks/useTheme'

export function ThemeToggleButton() {
  const { isDarkMode, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600"
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  )
}
