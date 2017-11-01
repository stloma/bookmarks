/* global fetch, window */

import React from 'react';
import PropTypes from 'prop-types';
import { TagCloud } from 'react-tagcloud';
import { Glyphicon } from 'react-bootstrap';
import Search from './Search';
import BookmarkTable from './BookmarkTable';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      bookmarks: [],
      tagcount: [],
      searchTerm: '',
      filterByTag: ''
    };
    this.loadData = this.loadData.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  componentDidMount() {
    // if /, load personal bookmarks. if discover, load everyone else's
    const location = window.location.pathname;
    if (location === '/') {
      this.loadData('bookmarks');
    } else if (location === '/discover') {
      this.loadData('discover');
    }
  }

  async onDeleteClick(id) {
    const fetchData = {
      method: 'DELETE',
      credentials: 'include'
    };
    const response = await fetch(`/api/bookmarks/${id}`, fetchData);
    if (!response.ok) {
      console.log(`Failed to delete bookmark: ${id}`);
    } else {
      this.loadData();
    }
  }

  async loadData(path = 'bookmarks') {
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    };

    try {
      const response = await fetch(`/api/${path}`, fetchData);
      if (response.ok) {
        const data = await response.json();
        this.setState({
          bookmarks: data.records,
          tagcount: data.tagcount
        });
      } else {
        const error = await response.json();
        console.log(`Failed to fetch issues: ${error.message}`);
      }
    } catch (error) {
      console.log(`Error in fetching data from server: ${error}`);
    }
  }

  searchTerm = (event) => {
    if (!event.target) {
      this.setState({ searchTerm: event },
        () => { this.props.searchToggle(); },
      );
    } else {
      this.setState({ searchTerm: event.target.value });
    }
  }

  filterByTag = (event) => {
    this.setState({ filterByTag: event.value });
  }

  clearTagFilter = () => {
    this.setState({ filterByTag: '' });
    this.props.tagsToggle();
  }

  clearSearch = () => {
    this.setState({ searchTerm: '' });
    this.props.searchToggle();
  }

  render() {
    const options = {
      luminosity: 'light',
      disableRandomColor: true
    };

    return (
      <div id='pattern'>
        <div className='container'>
          {this.props.showTags &&
          <div >
            <div className='well' id='tagcloud'>
              <Glyphicon id='remove-search' onClick={this.clearTagFilter} glyph='remove' />
              <TagCloud
                minSize={12}
                maxSize={35}
                colorOptions={options}
                className='simple-cloud'
                tags={this.state.tagcount}
                onClick={this.filterByTag}
                shuffle={false}
              />
            </div>
          </div>
          }
          { this.props.showSearch &&
            <div id='search'>
              <Search
                searchToggle={this.props.searchToggle}
                clearSearch={this.clearSearch}
                searchTerm={this.searchTerm}
              />
            </div>
          }
          <BookmarkTable
            bookmarks={this.state.bookmarks}
            onDeleteClick={this.onDeleteClick}
            searchTerm={this.state.searchTerm}
            searchTermFn={this.searchTerm}
            filterByTag={this.state.filterByTag}
          />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  searchToggle: PropTypes.func.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  showSearch: PropTypes.bool.isRequired,
  showTags: PropTypes.bool.isRequired
};
