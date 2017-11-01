/* globals fetch, document */

import React from 'react';
import PropTypes from 'prop-types';
import Errors from './Errors';

export default class AddBookmark extends React.Component {
  constructor() {
    super();

    this.state = {
      errors: false
    };
  }

  async createBookmark(newBookmark) {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookmark),
        credentials: 'include'
      });
      if (response.ok) {
        this.props.history.push('/');
      } else {
        const errors = await response.json();
        this.setState({ errors });
      }
    } catch (error) {
      console.log(`Error in sending data to server: ${error.message}`);
    }
  }

  closeError = (removeError) => {
    const errors = this.state.errors.filter(error => error !== removeError);
    this.setState({ errors });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const form = document.forms.SiteAdd;

    // Filter duplicate tags
    let tags = new Set(form.tags.value.split(' '));
    let unique = '';
    tags.forEach((tag) => { unique += ` ${tag}`; });
    tags = unique.trim();

    this.createBookmark({
      name: form.name.value,
      url: form.url.value,
      comment: form.comment.value,
      tags: form.tags.value
    });
  }

  cancel = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div id='pattern'>
        {this.state.errors &&
          <Errors closeError={this.closeError} errors={this.state.errors} />}
        <div className='container well' id='addbookmark'>
          <form method='POST' name='SiteAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Create Bookmark</legend>
              <div className='form-group'>
                <label htmlFor='name' >Name:</label>
                <input
                  autoFocus
                  type='text'
                  className='form-control'
                  name='name'
                  id='name'
                  placeholder='Name'
                />
                <label htmlFor='url'>Url:</label>
                <input
                  type='text'
                  id='url'
                  className='form-control'
                  name='url'
                  placeholder='Url'
                />
                <label htmlFor='comment'>Comment:</label>
                <input
                  type='text'
                  id='comment'
                  className='form-control'
                  name='comment'
                  placeholder='Comment'
                />
                <label htmlFor='tags'>Tags:</label>
                <input
                  type='text'
                  id='tags'
                  className='form-control'
                  name='tags'
                  placeholder='Space separated (e.g., personal banking finance)'
                />
                <div className='form-group'>
                  <div className='form-button'>
                    <button
                      onClick={this.cancel}
                      type='reset'
                      className='btn btn-default'
                    >
                      Cancel
                    </button>
                    <button className='btn btn-primary'>Submit</button>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

AddBookmark.propTypes = {
  history: PropTypes.object.isRequired
};
