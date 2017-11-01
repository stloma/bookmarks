/* globals fetch */

import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { sortBy as _sortBy } from 'lodash';
import ModalContainer from './Modal';
import BookmarkRow from './BookmarkRow';

const sortLookup = {
  '1': { by: 'name', order: 'desc', title: 'Name (a-z)' },
  '2': { by: 'name', order: 'asc', title: 'Name (z-a)' },
  '3': { by: '', order: 'asc', title: 'Newest' },
  '4': { by: '', order: 'desc', title: 'Oldest' }
};

export default class BookmarkTable extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      filterByTag: '',
      editBookmark: false,
      sortBy: 'name',
      sortOrder: 'desc',
      sortTitle: 'Name (a-z)',
      notifcations: false
    };
    this.save = this.save.bind(this);
  }

  showModal = (id, name) => {
    this.setState({ showModal: { id, name } });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  confirmDelete = () => {
    this.props.onDeleteClick(this.state.showModal.id);
    this.setState({ showModal: false });
  }

  filterByTag = (tag) => {
    this.setState({ filterByTag: tag });
  }

  clearTags = () => {
    this.setState({ filterByTag: '' });
  }

  sort = (e) => {
    let sortBy;
    switch (e) {
      case '2':
        sortBy = sortLookup['2'];
        break;
      case '3':
        sortBy = sortLookup['3'];
        break;
      case '4':
        sortBy = sortLookup['4'];
        break;
      default:
        sortBy = sortLookup['1'];
    }

    const { by, order, title } = sortBy;

    this.setState({
      sortOrder: order,
      sortBy: by,
      sortTitle: title
    });
  }

  edit = (bookmark) => {
    this.setState({ editBookmark: bookmark });
  }

  async save(bookmark) {
    const newBookmark = Object.assign({}, bookmark);
    delete newBookmark._id;
    delete newBookmark.createdBy;
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookmark),
        credentials: 'include'
      });
      if (response.ok) {
        this.setState({ notifications: 'Save successful!' });
      } else {
        const errors = await response.json();
        this.setState({ errors });
      }
    } catch (error) { this.setState({ errors: `Error saving bookmark: ${error}` }); }
  }

  clearNotifications = () => {
    this.setState({ notifications: false });
  }

  render() {
    if (this.state.editBookmark) {
      return (
        <Redirect
          push
          to={{
            pathname: '/editbookmark',
            state: { bookmark: this.state.editBookmark }
          }}
        />
      );
    }

    const { searchTerm, filterByTag: propsFilterByTag } = this.props;
    const { filterByTag: stateFilterByTag } = this.state;
    const filter = [searchTerm, propsFilterByTag, stateFilterByTag].find(Boolean) || '';

    const { sortBy, sortOrder } = this.state;
    let { sortTitle } = this.state;

    sortTitle = <span><b>Sort By: </b><span id='sort-by'>{sortTitle}</span></span>;

    const sorted = _sortBy(this.props.bookmarks, sortBy, sortOrder);

    if (sortOrder === 'asc') {
      sorted.reverse();
    }

    const bookmarkRows = sorted
      .filter(bookmark => (`${bookmark.name} ${bookmark.url} ${bookmark.comment} ${bookmark.tags} ${bookmark.createdBy}`)
        .toUpperCase().indexOf(filter.toUpperCase()) >= 0)
      .map(bookmark =>
        (<BookmarkRow
          key={bookmark._id}
          showModal={this.showModal}
          filterByTag={this.filterByTag}
          edit={this.edit}
          save={this.save}
          bookmark={bookmark}
          searchTermFn={this.props.searchTermFn}
        />));

    let tagHeading;
    if (this.state.filterByTag) {
      tagHeading =
        (<button onClick={this.clearTags} className='btn btn-default'>
          <b>Clear tags</b>
        </button>);
    }

    return (
      <div>
        {this.state.notifications &&
          <div className='alert alert-success alert-dismissable'>
            <button
              onClick={this.clearNotifications}
              className='close'
              data-dismiss='alert'
              aria-label='close'
            >
              &times;
            </button>
            <strong>{this.state.notifications}</strong>
          </div>
        }
        {this.state.showModal &&
        <ModalContainer
          modalTitle={this.state.showModal}
          showModal
          closeModal={this.closeModal}
          confirmDelete={this.confirmDelete}
        />
        }
        <div className='container' id='display-controls'>

          <div id='clear-tags'>{tagHeading}</div>
          <DropdownButton onSelect={this.sort} title={sortTitle} id='bg-nested-dropdown'>
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
    );
  }
}

BookmarkTable.propTypes = {
  bookmarks: PropTypes.array.isRequired,
  filterByTag: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  searchTermFn: PropTypes.func.isRequired
};
