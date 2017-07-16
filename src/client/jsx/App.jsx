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
    this.loadData()
  }

  onDeleteClick (id) {
    let fetchData = {
      method: 'DELETE',
      credentials: 'include'
    }
    fetch(`/api/bookmarks/${id}`, fetchData).then(response => {
      if (!response.ok) { console.log('Failed to delete bookmark: ' + id) } else this.loadData()
    })
  }

  onInfoClick (id) {
    console.log('Clicked info for site: ', id)
  }

  loadData () {
    let fetchData = {
      method: 'GET',
      credentials: 'include'
    }

    fetch('/api/bookmarks', fetchData).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({
            bookmarks: data.records,
            tagcount: data.tagcount
          })
        })
      } else {
        response.json().then(error => {
          console.log('Failed to fetch issues: ' + error.message)
        })
      }
    }).catch(err => {
      console.log('Error in fetching data from server: ', err)
    })
  }

  searchTerm (event) {
    this.setState({ searchTerm: event.target.value })
  }

  filterByTag (event) {
    this.setState({ filterByTag: event.value })
  }

  clearTagFilter (event) {
    this.setState({ filterByTag: '' })
    this.props.showTagsFn()
  }

  clearSearch () {
    this.setState({ searchTerm: '' })
    this.props.showSearchFn()
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
            <div className='well' id='tagcloud'>
              <Glyphicon id='remove-search' onClick={this.clearTagFilter} glyph='remove-sign' />
              <TagCloud
                minSize={12} maxSize={35}
                colorOptions={options} className='simple-cloud'
                tags={this.state.tagcount}
                onClick={this.filterByTag}
                shuffle={false}
              />
            </div>
          }

          { this.props.showSearch &&
            <div id='search'>
              <Search
                showSearch={this.props.showSearchFn}
                clearSearch={this.clearSearch}
                searchTerm={this.searchTerm}
              />
            </div>
          }

          <BookmarkTable
            onDeleteClick={this.onDeleteClick}
            onInfoClick={this.onInfoClick}
            searchTerm={this.state.searchTerm}
            bookmarks={this.state.bookmarks}
            filterByTag={this.state.filterByTag}
          />

        </div>
      </div>
    )
  }
}
