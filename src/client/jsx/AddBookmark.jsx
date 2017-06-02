import React from 'react'

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
        <form action='/' name='SiteAdd' onSubmit={this.handleSubmit}>
          <input type='text' name='name' placeholder='Name' />
          <input type='text' name='url' placeholder='Url' />
          <input type='text' name='comment' placeholder='Comment' />
          <input type='text' name='tags' placeholder='Comma seperated tags' />
          <input type='checkbox' name='private' value='private' />
          <button>Add</button>
        </form>
      </div>
    )
  }
}
