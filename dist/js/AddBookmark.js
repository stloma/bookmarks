'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* globals fetch, document */

var AddBookmark = function AddBookmark(props) {
  async function createBookmark(newbookmark) {
    try {
      var response = await fetch('/api/bookmarks', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newbookmark),
        credentials: 'include'
      });
      if (response.ok) {
        props.history.push('/');
      } else {
        var errors = await response.json();
        props.alert({ messages: errors, type: 'danger' });
      }
    } catch (error) {
      props.alert({ messages: 'Error in sending data to server: ' + error.message, type: 'danger' });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    var form = document.forms.SiteAdd;

    // Filter duplicate tags
    var tags = new Set(form.tags.value.split(' '));
    var unique = '';
    tags.forEach(function (tag) {
      unique += ' ' + tag;
    });
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

  return _react2.default.createElement(
    'div',
    { id: 'pattern' },
    _react2.default.createElement(
      'div',
      { className: 'container well', id: 'addbookmark' },
      _react2.default.createElement(
        'form',
        { method: 'POST', name: 'SiteAdd', onSubmit: handleSubmit },
        _react2.default.createElement(
          'fieldset',
          null,
          _react2.default.createElement(
            'legend',
            null,
            'Create Bookmark'
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'label',
              { htmlFor: 'name' },
              'Name:'
            ),
            _react2.default.createElement('input', {
              autoFocus: true,
              type: 'text',
              className: 'form-control',
              name: 'name',
              id: 'name',
              placeholder: 'Name'
            }),
            _react2.default.createElement(
              'label',
              { htmlFor: 'url' },
              'Url:'
            ),
            _react2.default.createElement('input', {
              type: 'text',
              id: 'url',
              className: 'form-control',
              name: 'url',
              placeholder: 'Url'
            }),
            _react2.default.createElement(
              'label',
              { htmlFor: 'comment' },
              'Comment:'
            ),
            _react2.default.createElement('input', {
              type: 'text',
              id: 'comment',
              className: 'form-control',
              name: 'comment',
              placeholder: 'Comment'
            }),
            _react2.default.createElement(
              'label',
              { htmlFor: 'tags' },
              'Tags:'
            ),
            _react2.default.createElement('input', {
              type: 'text',
              id: 'tags',
              className: 'form-control',
              name: 'tags',
              placeholder: 'Space separated (e.g., personal banking finance)'
            }),
            _react2.default.createElement(
              'div',
              { className: 'form-group' },
              _react2.default.createElement(
                'div',
                { className: 'form-button' },
                _react2.default.createElement(
                  'button',
                  {
                    onClick: cancel,
                    type: 'reset',
                    className: 'btn btn-default'
                  },
                  'Cancel'
                ),
                _react2.default.createElement(
                  'button',
                  { className: 'btn btn-primary' },
                  'Submit'
                )
              )
            )
          )
        )
      )
    )
  );
};

AddBookmark.propTypes = {
  history: _propTypes2.default.object.isRequired,
  alert: _propTypes2.default.func.isRequired
};

exports.default = AddBookmark;