import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon } from 'react-bootstrap'

const Search = props => (
  <div>
    <Glyphicon id='remove-search' onClick={props.clearSearch} glyph='remove' />
    <div>
      <input autoFocus value={props.searchTerm} onChange={e => props.searchTermFn(e)} type='text' placeholder='Search' />
    </div>
  </div>
)

Search.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  searchTermFn: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired
}

export default Search
