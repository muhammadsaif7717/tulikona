'use client'

import { ReactNode, useState, createContext } from 'react'

type SearchContextType = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
)

export default function SaearchProvider({ children }: { children: ReactNode }) {
  ///states
  const [search, setSearch] = useState('')
  return <SearchContext value={{ search, setSearch }}>{children}</SearchContext>
}
