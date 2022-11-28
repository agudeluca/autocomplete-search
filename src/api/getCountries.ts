const API_BASE_URL = 'https://restcountries.com/v2/name'

interface CountriesResult {
  name: string
}

export const getCountriesName = async (text: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${text}?fields=name`)
    const data = await response.json()
    return data.map((item: CountriesResult) => item.name)
  } catch (error) {
    return []
  }
}
