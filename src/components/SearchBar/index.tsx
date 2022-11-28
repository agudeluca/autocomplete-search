import { useMemo, useState } from 'react'

import ListItems from '@/components/ListItems'

import { debounce } from '@/utils'

import constants from './constants'

import './SearchBar.module.css'
interface SearchBarProps {
  onSuggestionMade: (text: string) => Promise<string[]>
  maxSuggestions?: number
}

function SearchBar({ maxSuggestions = 10, onSuggestionMade }: SearchBarProps): JSX.Element {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<null | string[]>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getSuggestion = async (text: string): Promise<void> => {
    setSuggestions(await onSuggestionMade(text))
    setLoading(false)
  }

  const debounceRequest = useMemo(
    () => debounce((value: string) => getSuggestion(value), constants.debounceTimeout),
    []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value)
    if (e.target.value.length === 0) {
      setSuggestions(null)
      return
    }
    setLoading(true)
    setSuggestions([])
    debounceRequest(e.target.value)
  }
  const handleSuggestionClick = (item: string): void => {
    setValue(item)
    setSuggestions(null)
  }

  const handleFocused = (): void => {
    setFocused(!focused)
  }
  return (
    <div data-testid="SearchBar">
      <input
        type="text"
        onChange={handleChange}
        placeholder="Search countries"
        value={value}
        onFocus={handleFocused}
        onBlur={handleFocused}
      />
      {focused && (
        <ListItems
          items={suggestions}
          onItemClick={handleSuggestionClick}
          maxDisplayItems={maxSuggestions}
          isLoading={loading}
          selectedValue={value}
        />
      )}
    </div>
  )
}

export default SearchBar
