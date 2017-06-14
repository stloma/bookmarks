/* globals fetch */

import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

export default class AddBookmark extends React.Component {
  constructor () {
    super()

    this.state = ({ bookmarks: [] })
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  createBookmark (newBookmark) {
    fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBookmark)
    })
    .then(response => {
      if (response.ok) {
        response.json().then(updatedBookmark => {
          updatedBookmark.created = new Date().getTime()
          const newBookmarks = this.state.bookmarks.concat(updatedBookmark)
          this.setState({ bookmarks: newBookmarks })
        })
      } else {
        response.json().then(error => {
          console.log('Failed to add issue: ' + error.message)
        })
      }
    }).catch(err => {
      console.log('Error in sending data to server: ' + err.message)
    })
  }

  handleSubmit (e) {
    var form = document.forms.SiteAdd
    this.createBookmark({
      name: form.name.value,
      url: form.url.value,
      comment: form.comment.value,
      tags: form.tags.value
    })
    form.name.value = ''
    form.url.value = ''
    form.comment.value = ''
  }

  render () {
    return (
      <div>
        {/*
        Form is submitting to index, fix
      */}
        <div className='container well' id='addbookmark'>
          <form className='form-horizontal' action='/' name='SiteAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Create Bookmark</legend>

              <div className='form-group container'>
                <label className='control-label'>Name</label>
                <input type='text' className='form-control ' name='name' placeholder='Name' />
                <label className='control-label'>Url</label>
                <input type='text' className='form-control' name='url' placeholder='Url' />
                <label className='control-label'>Comment</label>
                <input type='text' className='form-control' name='comment' placeholder='Comment' />
                <label className='control-label'>Tags</label>
                <input type='text' className='form-control' name='tags' placeholder='Comma seperated (e.g., personal, banking, finance)' />
                <div className='float-right'>
                  <div className='form-group'>
                    <div className='col-lg-10 col-lg-offset-2'>
                      <button type='reset' className='btn btn-default'>Cancel</button>
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
