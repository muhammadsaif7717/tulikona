import { SearchContext } from '@/providers/SaearchProvider'
import { useContext } from 'react'

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used inside SearchProvider')
  }
  return context
}
