import React from 'react'

export const Search = (props) => {
  return (
    <div><input autoFocus onChange={props.searchTerm} type='text' placeholder='Search' /></div>
  )
}
