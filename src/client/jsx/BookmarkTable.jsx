import React from 'react'
import { Glyphicon } from 'react-bootstrap'
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
      sortOrder: 'desc'
    }
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.filterByTag = this.filterByTag.bind(this)
    this.edit = this.edit.bind(this)
    this.sort = this.sort.bind(this)
    this.clearTags = this.clearTags.bind(this)
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
    let sortBy = e.currentTarget.id.split('-')[1]

    console.log(this.state.sortOrder)
    let order = this.state.sortBy === sortBy
      ? (this.state.sortOrder === 'desc' ? 'asc' : 'desc')
      : 'desc'

    this.setState({ sortOrder: order })
    this.setState({ sortBy: sortBy })
  }

  edit (bookmark) {
    this.setState({ editBookmark: bookmark })
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

    const sortBy = this.state.sortBy
    const order = this.state.sortOrder

    let sorted = _sortBy(this.props.bookmarks, sortBy, order)

    if (order === 'asc') {
      sorted.reverse()
    }

    const bookmarkRows = sorted
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

    let tagHeading
    if (this.state.filterByTag) {
      tagHeading =
        <th width='35%'>Tags<span id='clear-tags'>
          <Glyphicon
            onClick={this.clearTags}
            glyph='remove-sign'
                    />
        </span>
        </th>
    } else { tagHeading = <th width='35%'>Tags</th> }

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
          <thead >
            <tr className='active'>
              <th width='15%'>
                <span className='table-heading-sort'>Name</span>
                <Glyphicon
                  className='sort-button'
                  id='sort-name'
                  onClick={(e) => this.sort(e)}
                  glyph='sort'
                />
              </th>
              {tagHeading}
              <th width='25%'>Comment</th>
              <th width='10%'>
                <span className='table-heading-sort'>Created</span>
                <Glyphicon
                  className='sort-button'
                  id='sort-created'
                  onClick={(e) => this.sort(e)}
                  glyph='sort'
                />
              </th>
              <th width='10%'>Edit/Delete</th>
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
