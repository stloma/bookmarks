/* globals fetch */

import React from 'react'
import { Errors } from './Errors.jsx'

export default class AddBookmark extends React.Component {
  constructor () {
    super()

    this.state = ({
      errors: false
    })
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.closeError = this.closeError.bind(this)
  }

  createBookmark (newBookmark) {
    fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBookmark),
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
      console.log('Error in sending data to server: ' + err.message)
    })
  }

  closeError (removeError) {
    let errors = this.state.errors.filter(error => error !== removeError)
    this.setState({ errors: errors })
  }

  handleSubmit (event) {
    event.preventDefault()
    let form = document.forms.SiteAdd
    this.createBookmark({
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
        <div className='container well' id='addbookmark'>
          <form method='POST' name='SiteAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Create Bookmark</legend>

              <div className='form-group'>
                <label>Name:</label>
                <input
                  autoFocus
                  type='text'
                  className='form-control'
                  name='name'
                  placeholder='Name'
                />

                <label>Url:</label>
                <input
                  type='text'
                  className='form-control'
                  name='url'
                  placeholder='Url'
                />

                <label>Comment:</label>
                <input
                  type='text'
                  className='form-control'
                  name='comment'
                  placeholder='Comment'
                />

                <label>Tags:</label>
                <input
                  type='text'
                  className='form-control'
                  name='tags'
                  placeholder='Space separated (e.g., personal, banking, finance)'
                />

                <div className='form-group'>
                  <div className='form-button'>
                    <button onClick={this.cancel} type='reset' className='btn btn-default'>
                        Cancel
                      </button>
                    <button className='btn btn-primary' >
                        Submit
                      </button>
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
