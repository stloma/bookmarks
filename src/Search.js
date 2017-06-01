import React from 'react'

{/*
class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: ''
    }
  }
  render () {
*/}

const Search = (props) => {
    return (
      <input onChange={props.handleSearchTermChange} type="text" className="form-control" id="inputSearchTerm" placeholder="Search" />
    )
}

export default Search