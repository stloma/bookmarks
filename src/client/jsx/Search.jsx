import React from 'react'
import { Glyphicon } from 'react-bootstrap'

export const Search = (props) => {
  return (
    <div>
      <Glyphicon id='remove-search' onClick={props.clearSearch} glyph='remove' />
      <div><input autoFocus onChange={(e) => props.searchTerm(e)} type='text' placeholder='Search' /></div>
    </div>
  )
}
