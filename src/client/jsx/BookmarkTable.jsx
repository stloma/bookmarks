/* globals fetch, window */

import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { sortBy as _sortBy } from 'lodash';
import ModalContainer from './Modal';
import BookmarkRow from './BookmarkRow';

// Lookup table for types of sorts; selected by dropdown
const sortLookup = {
  '1': { by: 'name', order: 'desc', title: 'Name (a-z)' },
  '2': { by: 'name', order: 'asc', title: 'Name (z-a)' },
  '3': { by: 'created', order: 'asc', title: 'Newest' },
  '4': { by: 'created', order: 'desc', title: 'Oldest' }
};

// Filter duplicates if sorting by name
function noDupsByName(bookmarks) {
  const noDups = [];
  let keys;
  bookmarks.forEach((bookmark) => {
    if (!keys) {
      keys = bookmark;
      noDups.push(bookmark);
    } else if (keys.url !== bookmark.url) {
      noDups.push(bookmark);
      keys = bookmark;
    }
  });
  return noDups;
}

// Filter duplicates if sorting by date
function noDupsByDate(bookmarks) {
  const noDups = [];
  for (let i = 0; i < bookmarks.length; i += 1) {
    let seen = false;
    for (let j = i + 1; j < bookmarks.length; j += 1) {
      if (bookmarks[i].url === bookmarks[j].url) {
        seen = true;
      }
    }
    if (!seen) {
      noDups.push(bookmarks[i]);
    }
  }
  return noDups;
}

export default class BookmarkTable extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      filterByTag: '',
      editBookmark: false,
      sortBy: 'name',
      sortOrder: 'desc',
      sortTitle: 'Name (a-z)'
    };
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

  save = async (bookmark) => {
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
        this.props.alert({ messages: 'Save successful!', type: 'success' });
      } else {
        const errors = await response.json();
        this.props.alert({ messages: `Save failed: ${errors}`, type: 'danger' });
      }
    } catch (error) { this.props.alert({ messages: `Error saving bookmark: ${error}`, type: 'danger' }); }
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

    // Setup filtering
    const { searchTerm, filterByTag: propsFilterByTag } = this.props;
    const { filterByTag: stateFilterByTag } = this.state;
    const filter = [searchTerm, propsFilterByTag, stateFilterByTag].find(Boolean) || '';

    // Setup sorting
    const { sortBy, sortOrder } = this.state;
    let { sortTitle } = this.state;

    sortTitle = <span><b>Sort By: </b><span id='sort-by'>{sortTitle}</span></span>;

    let sorted = _sortBy(this.props.bookmarks, sortBy, sortOrder);

    // Remove duplicates if in /discover since it's pulling all users'
    // bookmarks. Two functions so it can get O(n) when sorting by name, rather
    // than the O(n^2) sorting by date requires
    if (window.location.pathname === '/discover') {
      if (sortBy === 'name') {
        sorted = noDupsByName(sorted);
      } else if (sortBy === 'created') {
        sorted = noDupsByDate(sorted);
      }
    }

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
  alert: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired
};
