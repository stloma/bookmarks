/* globals fetch, document */

import React from 'react'
import PropTypes from 'prop-types'

export default class EditBookmark extends React.Component {
  constructor(props) {
    super(props)

    const { bookmark } = this.props.location.state

    this.state = ({
      _id: bookmark._id,
      name: bookmark.name,
      url: bookmark.url,
      comment: bookmark.comment,
      tags: bookmark.tags
    })
  }

  async editBookmark(bookmark) {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmark),
        credentials: 'include'
      })
      if (response.ok) {
        this.props.history.push('/')
      } else {
        response.json().then((errors) => {
          this.props.alert({ messages: errors, type: 'danger' })
        })
      }
    } catch (error) { this.props.alert({ messages: `Failed editing bookmark: ${error}`, type: 'danger' }) }
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
    event.preventDefault()
    const form = document.forms.SiteAdd

    // Remove duplicate tags
    let tags = new Set(form.tags.value.split(' '))
    let unique = ''
    tags.forEach((tag) => { unique += ` ${tag}` })
    tags = unique.trim()

    this.editBookmark({
      _id: this.state._id,
      name: form.name.value,
      url: form.url.value,
      comment: form.comment.value,
      tags
    })
  }

  cancel = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <div id='pattern'>
        <div className='container well' id='editbookmark'>
          <form name='SiteAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Edit Bookmark</legend>
              <div className='form-group'>
                <label htmlFor='name'>Name:</label>
                <input
                  onChange={this.handleInputChange}
                  value={this.state.name}
                  autoFocus
                  type='text'
                  className='form-control '
                  name='name'
                  id='name'
                />
                <label htmlFor='url'>Url:</label>
                <input
                  onChange={this.handleInputChange}
                  value={this.state.url}
                  type='text'
                  className='form-control'
                  name='url'
                  id='url'
                />
                <label htmlFor='comment'>Comment:</label>
                <input
                  onChange={this.handleInputChange}
                  value={this.state.comment}
                  type='text'
                  className='form-control'
                  name='comment'
                  id='comment'
                />
                <label htmlFor='tags'>Tags:</label>
                <input
                  onChange={this.handleInputChange}
                  value={this.state.tags || ''}
                  type='text'
                  className='form-control'
                  name='tags'
                  id='tags'
                  placeholder='Space separated (e.g., personal banking finance)'
                />
                <div className='form-group'>
                  <div className='form-button'>
                    <button onClick={this.cancel} type='reset' className='btn btn-default'>
                      Cancel
                    </button>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
}

EditBookmark.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  alert: PropTypes.func.isRequired
}
