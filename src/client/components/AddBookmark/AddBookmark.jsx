/* globals fetch, document */

import React from 'react'
import PropTypes from 'prop-types'
import { sortBy as _sortBy } from 'lodash'
import { Glyphicon } from 'react-bootstrap'
import Loading from '../Loading/Loading'

export default class AddBookmark extends React.Component {
  constructor() {
    super()
    this.state = {
      recommendations: [],
      name: '',
      url: '',
      comment: '',
      tags: '',
      loading: false
    }
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    }
    let tags
    const mybookmarks = {}
    try {
      const response = await fetch('/api/bookmarks', fetchData)
      if (response.ok) {
        const data = await response.json()
        data.records.forEach((bookmark) => { mybookmarks[bookmark.url] = true })
        tags = _sortBy(data.tagcount, 'count').reverse()
      } else {
        const error = await response.json()
        this.props.alert({ messages: `Failed to download tags: ${error}`, type: 'danger' })
      }
    } catch (error) {
      this.props.alert({ messages: `Error in fetching data from server: ${error}`, type: 'danger' })
    }

    let communityBookmarks
    try {
      const response = await fetch('/api/discover', fetchData)
      if (response.ok) {
        const data = await response.json()
        communityBookmarks = data.records
      } else {
        const error = await response.json()
        this.props.alert({ messages: `Failed to download bookmarks: ${error}`, type: 'danger' })
      }
    } catch (error) {
      this.props.alert({ messages: `Error in fetching data from server: ${error}`, type: 'danger' })
    }

    let recommendations = []
    const seen = {}
    tags.forEach((tag) => {
      communityBookmarks.forEach((bookmark) => {
        if (
          !mybookmarks[bookmark.url] &&
          !seen[bookmark.url] &&
          bookmark.tags !== '' &&
          bookmark.tags.indexOf(tag.value) !== -1
        ) {
          recommendations.push(bookmark)
          seen[bookmark.url] = true
          mybookmarks[bookmark.url] = true
        }
      })
    })
    for (const bookmark of communityBookmarks) {
      if (recommendations.length > 4) {
        break
      }
      if (!mybookmarks[bookmark.url]) {
        recommendations.push(bookmark)
      }
    }
    if (!recommendations) { recommendations = communityBookmarks.slice(0, 5) }

    this.setState({ recommendations })
  }

  createBookmark = async (newbookmark) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newbookmark),
        credentials: 'include'
      })
      if (response.ok) {
        this.props.history.push('/')
      } else {
        const errors = await response.json()
        this.props.alert({ messages: errors, type: 'danger' })
      }
    } catch (error) {
      this.props.alert({ messages: `Error in sending data to server: ${error.message}`, type: 'danger' })
    } finally {
      this.props.loadingToggle()
    }
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    this.props.loadingToggle()
    event.preventDefault()
    const form = document.forms.SiteAdd

    // Filter duplicate tags
    let tags = new Set(form.tags.value.split(' '))
    let unique = ''
    tags.forEach((tag) => { unique += ` ${tag}` })
    tags = unique.trim()

    this.createBookmark({
      name: form.name.value,
      url: form.url.value,
      comment: form.comment.value,
      tags: form.tags.value
    })
  }

  save = (bookmark) => {
    this.setState({
      name: bookmark.name,
      url: bookmark.url,
      comment: bookmark.comment,
      tags: bookmark.tags
    })
  }

  cancel = () => {
    this.props.history.goBack()
  }

  render() {
    const recommendations = this.state.recommendations.map(item =>
      <div key={item.url}><a onClick={() => this.save(item)}>{item.name}</a></div>
    )
    if (this.state.loading) { return <Loading /> }

    return (
      <div id='pattern'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-4'>
              <div id='recommendations' className='alert-info'>
                <span id='recommend-header'>
                  <Glyphicon glyph='star' />
                  <p>Recommended for You</p>
                  <Glyphicon glyph='star' />
                </span>
                {recommendations}
              </div>
            </div>
            <div className='col-md-6'>
              <div className='container well' id='addbookmark'>
                <form method='POST' name='SiteAdd' onSubmit={this.handleSubmit}>
                  <fieldset>
                    <legend>Create Bookmark</legend>
                    <div className='form-group'>
                      <label htmlFor='name' >Name:</label>
                      <input
                        autoFocus
                        type='text'
                        className='form-control'
                        name='name'
                        id='name'
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        placeholder='Name'
                      />
                      <label htmlFor='url'>Url:</label>
                      <input
                        type='text'
                        id='url'
                        className='form-control'
                        name='url'
                        placeholder='Url'
                        onChange={this.handleInputChange}
                        value={this.state.url}
                      />
                      <label htmlFor='comment'>Comment:</label>
                      <input
                        type='text'
                        id='comment'
                        className='form-control'
                        name='comment'
                        placeholder='Comment'
                        onChange={this.handleInputChange}
                        value={this.state.comment}
                      />
                      <label htmlFor='tags'>Tags (space seperated, e.g., personal banking finance):</label>
                      <input
                        type='text'
                        id='tags'
                        className='form-control'
                        name='tags'
                        onChange={this.handleInputChange}
                        value={this.state.tags}
                        placeholder='Tags'
                      />
                      <div className='alert-info'>Hint: more tags = better recommendations</div>
                      <div className='form-group'>
                        <div className='form-button'>
                          <button
                            onClick={this.cancel}
                            type='reset'
                            className='btn btn-default'
                          >
                      Cancel
                          </button>
                          <button className='btn btn-primary'>Submit</button>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AddBookmark.propTypes = {
  history: PropTypes.object.isRequired,
  loadingToggle: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired
}
