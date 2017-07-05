/* globals fetch */

import React from 'react'

export default class EditBookmark extends React.Component {
  constructor (props) {
    super(props)

    const { bookmark } = this.props.location.state

    this.state = ({
      _id: bookmark._id,
      name: bookmark.name,
      url: bookmark.url,
      comment: bookmark.comment,
      tags: bookmark.tags
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
      response.json().then(error => {
        console.log('Failed to edit bookmark: ' + error.message)
      })
    }).catch(err => {
      console.log('Error in sending data to server: ' + err.message)
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
    form.name.value = ''
    form.url.value = ''
    form.comment.value = ''
    form.tags.value = ''
    this.props.history.push('/')
  }

  cancel () {
    this.props.history.goBack()
  }

  render () {
    return (
      <div>
        {/*
        Form is submitting to index, fix
      */}
        <div className='container well' id='editbookmark'>
          <form name='SiteAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Create Bookmark</legend>

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
                <div className='float-right'>
                  <div className='form-group'>
                    <div className='col-lg-10 col-lg-offset-2'>
                      <button onClick={this.cancel} type='reset' className='btn btn-default'>Cancel</button>
                      <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
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
