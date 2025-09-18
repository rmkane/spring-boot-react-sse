import { useContext } from 'react'

import { ThemeContext } from '@/contexts/ThemeContext'

export const useTheme = () => {
  const context = useContext(ThemeContext)
  return context || { isDarkMode: false, toggleTheme: () => {} }
}
