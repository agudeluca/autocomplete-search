import { Fragment } from 'react'

import classes from './LabelHighlighted.module.css'

interface LabelHighlightedProps {
  highlight: string
  value: string
}

const LabelHighlighted = ({ highlight, value }: LabelHighlightedProps): JSX.Element => {
  const parts = value.split(new RegExp(`(${highlight})`, 'gi'))
  return (
    <div data-testid="LabelHighlighted">
      {parts.map((part: string, index: number) => (
        <Fragment key={index}>
          {part.toLowerCase() === highlight.toLowerCase() ? (
            <span data-testid="HighlightedPart" className={classes.highlighted}>
              {part}
            </span>
          ) : (
            part
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default LabelHighlighted
