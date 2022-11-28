import { describe, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import ListItems from './index'

describe('ListItems component', () => {
  it('should render without items', async () => {
    render(<ListItems maxDisplayItems={15} selectedValue={''} items={[]} isLoading={false} onItemClick={vi.fn()} />)
    expect(screen.queryByTestId('listItems')).not.toBeInTheDocument()
  })

  it('should render with items', async () => {
    render(
      <ListItems
        maxDisplayItems={15}
        selectedValue={''}
        items={['German', 'Argentina']}
        isLoading={false}
        onItemClick={vi.fn()}
      />
    )
    expect(screen.getAllByTestId('item')).toHaveLength(2)
  })

  it('should render loading state', async () => {
    render(
      <ListItems
        maxDisplayItems={15}
        selectedValue={''}
        items={['German', 'Argentina']}
        isLoading={true}
        onItemClick={vi.fn()}
      />
    )
    expect(screen.getByTestId('items-loading')).toBeInTheDocument()
  })

  it('should render empty state', async () => {
    render(<ListItems maxDisplayItems={15} selectedValue={''} items={[]} isLoading={false} onItemClick={vi.fn()} />)
    expect(screen.getByTestId('no-items-found')).toBeInTheDocument()
  })
})
