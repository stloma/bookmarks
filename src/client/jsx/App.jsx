/* global fetch */

import React from 'react'
import { TagCloud } from 'react-tagcloud'
import { Glyphicon } from 'react-bootstrap'
import { Search } from './Search.jsx'
import { BookmarkTable } from './BookmarkTable.jsx'

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {
      bookmarks: [],
      tagcount: [],
      searchTerm: '',
      filterByTag: ''
    }
    this.loadData = this.loadData.bind(this)
    this.searchTerm = this.searchTerm.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.filterByTag = this.filterByTag.bind(this)
    this.clearTagFilter = this.clearTagFilter.bind(this)
    this.onInfoClick = this.onInfoClick.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
  }

  componentDidMount () {
    const location = window.location.pathname
    if (location === '/') {
      this.loadData('bookmarks')
    } else if (location === '/discover') {
      this.loadData('discover')
    }
  }

  onDeleteClick (id) {
    let fetchData = {
      method: 'DELETE',
      credentials: 'include'
    }
    fetch(`/api/bookmarks/${id}`, fetchData).then(response => {
      if (!response.ok) {
        console.log('Failed to delete bookmark: ' + id)
      } else {
        this.loadData()
      }
    })
  }

  onInfoClick (id) {
    console.log('Clicked info for site: ', id)
  }

  loadData (path = 'bookmarks') {
    let fetchData = {
      method: 'GET',
      credentials: 'include'
    }

    fetch(`/api/${path}`, fetchData).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({
            bookmarks: data.records,
            tagcount: data.tagcount
          })
        })
      } else {
        response.json().then(error => {
          console.log(`Failed to fetch issues: ${error.message}`)
        })
      }
    }).catch(error => {
      console.log(`Error in fetching data from server: ${error}`)
    })
  }

  searchTerm (event) {
    // const searchTerm = !event.target ? event : event.target.value
    if (!event.target) {
      this.setState({ searchTerm: event },
        () => { this.props.searchToggle() }
      )
    } else {
      this.setState({ searchTerm: event.target.value })
    }
    console.log(this.state.searchTerm)
  }

  filterByTag (event) {
    this.setState({ filterByTag: event.value })
  }

  clearTagFilter (event) {
    this.setState({ filterByTag: '' })
    this.props.tagsToggle()
  }

  clearSearch () {
    this.setState({ searchTerm: '' })
    this.props.searchToggle()
  }

  render () {
    const options = {
      luminosity: 'light',
      disableRandomColor: true
    }

    return (
      <div id='pattern'>
        <div className='container'>
          {this.props.showTags &&
          <div >
            <div className='well' id='tagcloud'>
              <Glyphicon id='remove-search' onClick={this.clearTagFilter} glyph='remove' />
              <TagCloud
                minSize={12} maxSize={35}
                colorOptions={options}
                className='simple-cloud'
                tags={this.state.tagcount}
                onClick={this.filterByTag}
                shuffle={false}
              />
            </div>
          </div>
          }
          { this.props.showSearch &&
            <div id='search'>
              <Search
                searchToggle={this.props.searchToggle}
                clearSearch={this.clearSearch}
                searchTerm={this.searchTerm}
              />
            </div>
          }
          <BookmarkTable
            onDeleteClick={this.onDeleteClick}
            onInfoClick={this.onInfoClick}
            searchTerm={this.state.searchTerm}
            searchTermFn={this.searchTerm}
            searchToggle={this.props.searchToggle}
            bookmarks={this.state.bookmarks}
            filterByTag={this.state.filterByTag}
          />
        </div>
      </div>
    )
  }
}
