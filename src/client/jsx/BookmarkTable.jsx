/* globals fetch */

import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { sortBy as _sortBy } from 'lodash'
import { ModalContainer } from './Modal.jsx'
import { BookmarkRow } from './BookmarkRow.jsx'

export class BookmarkTable extends React.Component {
  constructor () {
    super()
    this.state = {
      showModal: false,
      filterByTag: '',
      editBookmark: false,
      modalBody: '',
      sortBy: 'name',
      sortOrder: 'desc',
      sortTitle: <span><b>Sort By:</b> Name (a-z)</span>,
      notifcations: false
    }
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.filterByTag = this.filterByTag.bind(this)
    this.edit = this.edit.bind(this)
    this.sort = this.sort.bind(this)
    this.clearTags = this.clearTags.bind(this)
    this.save = this.save.bind(this)
    this.clearNotifications = this.clearNotifications.bind(this)
  }

  showModal (id, name) {
    let modalBody = (
      <div className='modal-buttons'>
        <button
          className='btn btn-warning modal-delete'
          onClick={this.confirmDelete} >
        Delete
        </button>
        <button
          className='btn btn-default modal-cancel'
          onClick={this.closeModal} >
        Close
        </button>
      </div>
    )

    this.setState({
      showModal: { id: id, name: name },
      modalBody: modalBody
    })
  }

  closeModal () {
    this.setState({ showModal: false })
  }

  confirmDelete (id) {
    this.props.onDeleteClick(this.state.showModal.id)
    this.setState({ showModal: false })
  }

  filterByTag (tag) {
    this.setState({ filterByTag: tag })
  }

  clearTags () {
    this.setState({ filterByTag: '' })
  }

  sort (e) {
    let by
    let ord
    let order
    switch (e) {
      case '1':
        by = 'name'
        ord = 'desc'
        order = '(a-z)'
        break
      case '2':
        by = 'name'
        ord = 'asc'
        order = '(z-a)'
        break
      case '3':
        by = ''
        ord = 'asc'
        order = 'Newest'
        break
      case '4':
        by = ''
        ord = 'desc'
        order = 'Oldest'
        break
    }

    const title = (<span><b>Sort By: </b>{by} {order}</span>)
    this.setState({ sortTitle: title })

    this.setState({ sortOrder: ord })
    this.setState({ sortBy: by })
  }

  edit (bookmark) {
    this.setState({ editBookmark: bookmark })
  }
  save (bookmark) {
    let newBookmark = Object.assign({}, bookmark)
    delete newBookmark._id
    delete newBookmark.createdBy
    fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBookmark),
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.setState({ notifications: `Save successful!` })
        } else {
          response.json().then(errors => {
            this.setState({ errors })
          })
        }
      })
      .catch(err => {
        console.log(`Error in sending data to server: ${err.message}`)
      })
  }
  clearNotifications () {
    console.log('clear notifications')
    this.setState({ notifications: false })
  }

  render () {
    if (this.state.editBookmark) {
      return (
        <Redirect
          push
          to={{
            pathname: '/editbookmark',
            state: { bookmark: this.state.editBookmark }
          }} />
      )
    }

    const filter =
      this.props.searchTerm ? this.props.searchTerm
      : this.props.filterByTag ? this.props.filterByTag
      : this.state.filterByTag ? this.state.filterByTag
      : ''

    const { sortBy, sortOrder } = this.state

    let sorted = _sortBy(this.props.bookmarks, sortBy, sortOrder)

    if (sortOrder === 'asc') {
      sorted.reverse()
    }

    const bookmarkRows = sorted
    .filter(bookmark => `${bookmark.name} ${bookmark.url} ${bookmark.comment} ${bookmark.tags} ${bookmark.createdBy}`
      .toUpperCase().indexOf(filter.toUpperCase()) >= 0)
      .map(bookmark =>
        <BookmarkRow
          key={bookmark._id}
          showModal={this.showModal}
          closeModal={this.closeModal}
          filterByTag={this.filterByTag}
          edit={this.edit}
          save={this.save}
          bookmark={bookmark}
          searchTermFn={this.props.searchTermFn}
          searchToggle={this.props.searchToggle}
        />)

    let tagHeading
    if (this.state.filterByTag) {
      tagHeading =
        <button onClick={this.clearTags} className='btn btn-default'>
          <b>Clear tags</b>
        </button>
    }

    return (

      <div>
        {this.state.notifications &&
          <div className='alert alert-success alert-dismissable'>
            <a onClick={this.clearNotifications} className='close' data-dismiss='alert' aria-label='close'>&times;</a>
            <strong>{this.state.notifications}</strong>
          </div>
        }
        {this.state.showModal &&
        <ModalContainer
          modalBody={this.state.modalBody}
          modalTitle={this.state.showModal}
          showModal
          closeModal={this.closeModal}
          confirmDelete={this.confirmDelete}
        />
        }
        <div className='container' id='display-controls'>

          <div id='clear-tags'>{tagHeading}</div>
          <DropdownButton onSelect={this.sort} title={this.state.sortTitle} id='bg-nested-dropdown'>
            <MenuItem eventKey='1'>Name (a-z)</MenuItem>
            <MenuItem eventKey='2'>Name (z-a)</MenuItem>
            <MenuItem eventKey='3'>Newest</MenuItem>
            <MenuItem eventKey='4'>Oldest</MenuItem>
          </DropdownButton>
        </div>
        <div id='cards' className='container'>
          <div className='row'>
            {bookmarkRows}
          </div>
        </div>
      </div>
    )
  }
}
