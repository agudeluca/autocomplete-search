import LabelHighlighted from '@/components/LabelHighlighted'
import classes from './ListItems.module.css'

interface ListItemsProps {
  items: null | string[]
  maxDisplayItems: number
  isLoading: boolean
  onItemClick: (item: string) => void
  selectedValue: string
}

const ListItems = ({
  items,
  maxDisplayItems,
  isLoading,
  onItemClick,
  selectedValue
}: ListItemsProps): JSX.Element | null => {
  if (items === null) return null

  if (items.length === 0 && !isLoading) return <span data-testid="no-items-found">No results found</span>

  if (isLoading) return <span data-testid="items-loading">Loading...</span>

  const handleItemClick = (item: string): void => {
    onItemClick(item)
  }

  return (
    <ul className={classes.listItems} data-testid="listItems">
      {items.slice(0, maxDisplayItems).map(item => (
        <li key={item} data-testid="item" onMouseDown={(): void => handleItemClick(item)}>
          <LabelHighlighted highlight={selectedValue} value={item} />
        </li>
      ))}
    </ul>
  )
}

export default ListItems
