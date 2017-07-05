import React from 'react'
import { Tooltip, Glyphicon, OverlayTrigger, Button, Alert } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { ModalContainer } from './Modal.jsx'
import { BookmarkRow } from './BookmarkRow.jsx'

export class BookmarkTable extends React.Component {
  constructor () {
    super()
    this.state = {
      showModal: false,
      filterByTag: '',
      editBookmark: false,
      modalBody: ''
    }
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.filterByTag = this.filterByTag.bind(this)
    this.edit = this.edit.bind(this)
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

  edit (bookmark) {
    this.setState({ editBookmark: bookmark })
  }

  render () {
    if (this.state.editBookmark) {
      return (
        <Redirect
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

    const bookmarkRows = this.props.bookmarks
    .filter(bookmark => `${bookmark.name} ${bookmark.url} ${bookmark.comment} ${bookmark.tags}`
      .toUpperCase().indexOf(filter.toUpperCase()) >= 0)
      .map(bookmark =>
        <BookmarkRow
          onDeleteClick={this.props.onDeleteClick}
          showModal={this.showModal}
          closeModal={this.closeModal}
          filterByTag={this.filterByTag}
          edit={this.edit}
          key={bookmark._id}
          bookmark={bookmark}
        />)

    return (

      <div>
        {this.state.showModal &&
        <ModalContainer
          modalBody={this.state.modalBody}
          modalTitle={this.state.showModal}
          showModal
          closeModal={this.closeModal}
          confirmDelete={this.confirmDelete}
        />
        }

        <table className='table table-striped table-hover'>
          <thead>
            <tr>
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
      </div>
    )
  }
}
