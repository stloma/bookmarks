import React from 'react'

export const Search = (props) => {
  return (
    <div><input onChange={props.searchTerm} type='text' placeholder='Search' /></div>
  )
}
