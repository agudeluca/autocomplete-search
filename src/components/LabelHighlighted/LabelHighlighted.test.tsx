import { describe, it } from 'vitest'

import { render, screen } from '@testing-library/react'

import LabelHighlighted from './index'

describe('SearchBar component', () => {
  it('should render', async () => {
    render(<LabelHighlighted highlight="ho" value="home" />)
    expect(screen.getByTestId('LabelHighlighted')).toBeInTheDocument()
  })
  it('should render val highlighted', async () => {
    render(<LabelHighlighted highlight="val" value="testvalue" />)
    expect(screen.getByTestId('HighlightedPart')).toHaveTextContent('val')
  })
})
