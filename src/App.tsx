import SearchBar from '@/components/SearchBar'

import { getCountriesName } from './api/getCountries'

import classes from './App.module.css'

function App(): JSX.Element {
  const handleOnSuggestionMade = (text: string): Promise<string[]> => getCountriesName(text)

  return (
    <div className={classes.container}>
      <SearchBar onSuggestionMade={handleOnSuggestionMade} />
    </div>
  )
}

export default App
