/* globals fetch */

import React from 'react'
import { Errors } from './Errors.jsx'

export default class EditBookmark extends React.Component {
  constructor (props) {
    super(props)

    const { bookmark } = this.props.location.state

    this.state = ({
      _id: bookmark._id,
      name: bookmark.name,
      url: bookmark.url,
      comment: bookmark.comment,
      tags: bookmark.tags,
      errors: false
    })
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  editBookmark (bookmark) {
    fetch('/api/bookmarks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark),
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        this.props.history.push('/')
      } else {
        response.json().then(errors => {
          this.setState({ errors: errors })
        })
      }
    }).catch(err => {
      console.log(`Error in sending data to server: ${err.message}`)
    })
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    var form = document.forms.SiteAdd
    this.editBookmark({
      _id: this.state._id,
      name: form.name.value,
      url: form.url.value,
      comment: form.comment.value,
      tags: form.tags.value
    })
  }

  cancel () {
    this.props.history.goBack()
  }

  render () {
    return (
      <div id='pattern'>
        {this.state.errors &&
        <Errors closeError={this.closeError} errors={this.state.errors} />
      }
        <div className='container well' id='editbookmark'>
          <form name='SiteAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Edit Bookmark</legend>

              <div className='form-group'>
                <label>Name:</label>
                <input
                  onChange={this.handleInputChange} value={this.state.name}
                  autoFocus type='text' className='form-control ' name='name' />
                <label>Url:</label>
                <input
                  onChange={this.handleInputChange} value={this.state.url}
                  type='text' className='form-control' name='url'
                />
                <label>Comment:</label>
                <input
                  onChange={this.handleInputChange} value={this.state.comment}
                  type='text' className='form-control' name='comment'
                />
                <label>Tags:</label>
                <input
                  onChange={this.handleInputChange} value={this.state.tags}
                  type='text' className='form-control' name='tags'
                />
                <div className='form-group'>
                  <div className='form-button'>
                    <button onClick={this.cancel} type='reset' className='btn btn-default'>Cancel</button>
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
