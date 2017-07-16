import React from 'react'
import { Glyphicon } from 'react-bootstrap'

export const Search = (props) => {
  return (
    <div>
      <Glyphicon id='remove-search' onClick={props.clearSearch} glyph='remove-sign' />
      <div><input autoFocus onChange={props.searchTerm} type='text' placeholder='Search' /></div>
    </div>
  )
}
