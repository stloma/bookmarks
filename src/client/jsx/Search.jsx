import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

const Search = props => (
  <div>
    <Glyphicon id='remove-search' onClick={props.clearSearch} glyph='remove' />
    <div>
      <input autoFocus onChange={e => props.searchTerm(e)} type='text' placeholder='Search' />
    </div>
  </div>
);

Search.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.func.isRequired
};

export default Search;
