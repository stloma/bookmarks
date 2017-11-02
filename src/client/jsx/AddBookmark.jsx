/* globals fetch, document */

import React from 'react';
import PropTypes from 'prop-types';

const AddBookmark = (props) => {
  async function createBookmark(newbookmark) {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newbookmark),
        credentials: 'include'
      });
      if (response.ok) {
        props.history.push('/');
      } else {
        const errors = await response.json();
        props.alert({ messages: errors, type: 'danger' });
      }
    } catch (error) {
      props.alert({ messages: `Error in sending data to server: ${error.message}`, type: 'danger' });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = document.forms.SiteAdd;

    // Filter duplicate tags
    let tags = new Set(form.tags.value.split(' '));
    let unique = '';
    tags.forEach((tag) => { unique += ` ${tag}`; });
    tags = unique.trim();

    createBookmark({
      name: form.name.value,
      url: form.url.value,
      comment: form.comment.value,
      tags: form.tags.value
    });
  }

  function cancel() {
    props.history.goBack();
  }

  return (
    <div id='pattern'>
      <div className='container well' id='addbookmark'>
        <form method='POST' name='SiteAdd' onSubmit={handleSubmit}>
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
                    onClick={cancel}
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
};

AddBookmark.propTypes = {
  history: PropTypes.object.isRequired,
  alert: PropTypes.func.isRequired
};

export default AddBookmark;
