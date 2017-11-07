/* global fetch, window */

import React from 'react'
import PropTypes from 'prop-types'
import { TagCloud } from 'react-tagcloud'
import { Glyphicon } from 'react-bootstrap'
import Search from './Search'
import BookmarkTable from './BookmarkTable'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      bookmarks: [],
      tagcount: [],
      searchTerm: '',
      filterByTag: ''
    }
  }

  componentDidMount() {
    // if /, load personal bookmarks. if discover, load everyone else's
    const location = window.location.pathname
    if (location === '/') {
      this.loadData('bookmarks')
    } else if (location === '/discover') {
      this.loadData('discover')
    }
  }

  onDeleteClick = async (id) => {
    const fetchData = {
      method: 'DELETE',
      credentials: 'include'
    }
    const response = await fetch(`/api/bookmarks/${id}`, fetchData)
    if (!response.ok) {
      this.props.alert({ messages: `Failed to delete bookmark: ${id}`, type: 'danger' })
    } else {
      this.loadData()
    }
  }

  loadData = async (path = 'bookmarks') => {
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    }

    try {
      const response = await fetch(`/api/${path}`, fetchData)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          bookmarks: data.records,
          tagcount: data.tagcount
        })
      } else {
        const error = await response.json()
        this.props.alert({ messages: `Failed to download bookmarks: ${error}`, type: 'danger' })
      }
    } catch (error) {
      this.props.alert({ messages: `Error in fetching data from server: ${error}`, type: 'danger' })
    }
  }

  searchTerm = (event) => {
    if (!event.target) {
      this.props.searchToggle()
      this.setState({ searchTerm: event })
    } else {
      this.setState({ searchTerm: event.target.value })
    }
  }

  filterByTagFn = (event) => {
    this.setState({ filterByTag: event.value })
  }

  clearTagFilter = () => {
    this.setState({ filterByTag: '' })
    this.props.tagsToggle()
  }

  clearSearch = () => {
    this.setState({ searchTerm: '' })
    this.props.searchToggle()
  }

  render() {
    const options = {
      luminosity: 'light',
      format: 'rgb',
      disableRandomColor: true
    }

    return (
      <div id='pattern'>
        <div className='container'>
          {this.props.showTags &&
            <div className='well' id='tagcloud'>
              <Glyphicon id='remove-search' onClick={this.clearTagFilter} glyph='remove' />
              <TagCloud
                minSize={14}
                maxSize={30}
                colorOptions={options}
                className='simple-cloud'
                tags={this.state.tagcount}
                onClick={this.filterByTagFn}
                shuffle={false}
              />
            </div>
          }
          { this.props.showSearch &&
            <div id='search'>
              <Search
                clearSearch={this.clearSearch}
                searchTermFn={this.searchTerm}
                searchTerm={this.state.searchTerm}
              />
            </div>
          }
          <BookmarkTable
            bookmarks={this.state.bookmarks}
            onDeleteClick={this.onDeleteClick}
            searchTerm={this.state.searchTerm}
            filterByTag={this.state.filterByTag}
            alert={this.props.alert}
            clearFilters={this.props.clearFilters}
          />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  searchToggle: PropTypes.func.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  showSearch: PropTypes.bool.isRequired,
  showTags: PropTypes.bool.isRequired,
  clearFilters: PropTypes.func.isRequired
}
