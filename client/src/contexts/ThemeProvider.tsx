import { useEffect, useState, type ReactNode } from 'react'

import { ThemeContext } from '@/contexts/ThemeContext'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize with localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      return mediaQuery.matches
    }
    return false
  })

  const [hasUserInteracted, setHasUserInteracted] = useState(() => {
    // Check if user has previously set a theme preference
    return typeof window !== 'undefined' && localStorage.getItem('theme') !== null
  })

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    setHasUserInteracted(true)
  }

  useEffect(() => {
    // Only save to localStorage if user has explicitly interacted
    if (hasUserInteracted) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }
  }, [isDarkMode, hasUserInteracted])

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}
