/* global fetch */

import React from 'react'
import { TagCloud } from 'react-tagcloud'
import { Link, withRouter } from 'react-router-dom'
import { Glyphicon, Button } from 'react-bootstrap'
import { Search } from './Search.jsx'

function BookmarkTable (props) {
  const filter = props.searchTerm ? props.searchTerm : props.filterByTag ? props.filterByTag : ''

  const bookmarkRows = props.bookmarks
    .filter(bookmark => `${bookmark.name} ${bookmark.url} ${bookmark.comment} ${bookmark.tags}`
      .toUpperCase().indexOf(filter.toUpperCase()) >= 0)
    .map(bookmark => <BookmarkRow onDeleteClick={props.onDeleteClick} key={bookmark._id} bookmark={bookmark} />)

  return (
    <table className='table table-striped table-hover'>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Url</th>
          <th>Tags</th>
          <th>Comment</th>
          <th>Created</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {bookmarkRows}
      </tbody>
    </table>
  )
}

const BookmarkRow = (props) => {
  return (
    <tr>
      <td><Link to={`/bookmarks/${props.bookmark._id}`}>{props.bookmark._id.substr(-4)}</Link></td>
      <td>{props.bookmark.name}</td>
      <td>{props.bookmark.url}</td>
      <td>{props.bookmark.tags}</td>
      <td>{props.bookmark.comment}</td>
      <td>{new Date(props.bookmark.created).toString()}</td>
      <td><Button bsSize='xsmall' onClick={() => props.onDeleteClick(props.bookmark._id)}><Glyphicon glyph='trash' /></Button></td>
    </tr>
  )
}

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {
      bookmarks: [],
      tagcount: [],
      loggedIn: false,
      searchTerm: '',
      filterByTag: ''
    }
    this.loadData = this.loadData.bind(this)
    this.searchTerm = this.searchTerm.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.filterByTag = this.filterByTag.bind(this)
    this.clearTagFilter = this.clearTagFilter.bind(this)
  }

  componentDidMount () {
    this.loadData()
  }

  /*
  componentDidUpdate (prevProps) {
    console.log(prevProps)
    const oldQuery = prevProps.location.search
    const newQuery = this.props.location.search

    if (oldQuery === newQuery) {
      return
    }
    this.loadData()
  }
  */

  onDeleteClick (id) {
    let fetchData = {
      method: 'DELETE',
      credentials: 'include'
    }
    fetch(`/api/bookmarks/${id}`, fetchData).then(response => {
      if (!response.ok) { console.log('Failed to delete bookmark: ' + id) } else this.loadData()
    })
  }

  loadData () {
    let fetchData = {
      method: 'GET',
      credentials: 'include'
    }

    fetch(`/api/bookmarks`, fetchData).then(response => {
      if (response.status === 401) {
        this.props.history.push('/login')
      } else if (response.ok) {
        response.json().then(data => {
          console.log('Total count of records: ', data._metadata.total_count)
          this.setState({
            bookmarks: data.records,
            tagcount: data.tagcount,
            loggedIn: true
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
  }

  render () {
    const options = {
      luminosity: 'light',
      hue: 'blue',
      disableRandomColor: true
    }

    return (
      <div>
        <div className='container'>

          {this.props.showTags &&
            <div className='well' id='tagcloud'>
              <a id='clear-tags' onClick={this.clearTagFilter}>X</a>
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
              <Search searchTerm={this.searchTerm} />
            </div>
          }

          <BookmarkTable
            onDeleteClick={this.onDeleteClick}
            searchTerm={this.state.searchTerm}
            bookmarks={this.state.bookmarks}
            filterByTag={this.state.filterByTag}
          />

        </div>
      </div>
    )
  }
}
