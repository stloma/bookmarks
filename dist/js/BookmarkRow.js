'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BookmarkRow = function BookmarkRow(props) {
  var trash = _react2.default.createElement(
    _reactBootstrap.Tooltip,
    { id: 'modal-tooltip' },
    'Delete'
  );
  var edit = _react2.default.createElement(
    _reactBootstrap.Tooltip,
    { id: 'modal-tooltip' },
    'Edit'
  );
  var save = _react2.default.createElement(
    _reactBootstrap.Tooltip,
    { id: 'modal-tooltip' },
    'Save'
  );

  var tags = void 0;
  // To avoid no-unused-prop-types linting error
  var filterByTag = props.filterByTag;

  if (props.bookmark.tags) {
    tags = props.bookmark.tags.split(' ').map(function (tag) {
      return _react2.default.createElement(
        'button',
        {
          onClick: function onClick() {
            return filterByTag(tag);
          },
          key: props.bookmark._id + tag,
          type: 'button',
          className: 'btn btn-xs tag-button'
        },
        tag
      );
    });
  }

  var comment = props.bookmark.comment;

  var overlay = void 0;
  if (comment.length > 20) {
    // Shorten displayed comment and add tooltip to see entire comment
    var tmp = comment.substr(0, 21);
    overlay = comment;
    comment = tmp;
    overlay = _react2.default.createElement(
      _reactBootstrap.Tooltip,
      { id: 'comment-tooltip' },
      overlay
    );
  }

  var pathname = window.location.pathname;
  var buttons = void 0;
  switch (pathname) {
    case '/':
      buttons = _react2.default.createElement(
        'div',
        { className: 'card-buttons' },
        _react2.default.createElement(
          _reactBootstrap.OverlayTrigger,
          { placement: 'bottom', overlay: edit },
          _react2.default.createElement(
            _reactBootstrap.Button,
            {
              className: 'table-actions',
              bsSize: 'xsmall',
              onClick: function onClick() {
                return props.edit(props.bookmark);
              }
            },
            _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'edit' })
          )
        ),
        _react2.default.createElement(
          _reactBootstrap.OverlayTrigger,
          { placement: 'bottom', overlay: trash },
          _react2.default.createElement(
            _reactBootstrap.Button,
            {
              className: 'table-actions',
              bsSize: 'xsmall',
              onClick: function onClick() {
                return props.showModal(props.bookmark._id, props.bookmark.name);
              }
            },
            _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'trash' })
          )
        )
      );
      break;
    case '/discover':
      buttons = _react2.default.createElement(
        'div',
        null,
        props.bookmark.createdBy && _react2.default.createElement(
          'div',
          { onClick: function onClick() {
              return props.searchTermFn(props.bookmark.createdBy);
            } },
          'Created by: ',
          props.bookmark.createdBy
        ),
        _react2.default.createElement(
          'div',
          { className: 'card-buttons' },
          _react2.default.createElement(
            _reactBootstrap.OverlayTrigger,
            { placement: 'bottom', overlay: save },
            _react2.default.createElement(
              _reactBootstrap.Button,
              {
                className: 'table-actions',
                bsSize: 'xsmall',
                onClick: function onClick() {
                  return props.save(props.bookmark);
                }
              },
              _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'floppy-save' })
            )
          )
        )
      );
      break;
    default:
  }

  return _react2.default.createElement(
    'div',
    { className: 'col-md-4 col-sm-6 bookmark-card-wrapper' },
    _react2.default.createElement(
      'div',
      { className: 'col-sm-14 col-md-12 bookmark-card-inner' },
      _react2.default.createElement(
        'div',
        { className: 'card-heading' },
        _react2.default.createElement(
          'a',
          { href: props.bookmark.url },
          _react2.default.createElement('img', {
            alt: props.bookmark.name + ' favicon',
            className: 'favicon',
            src: '/images/favicons/' + props.bookmark.favicon,
            height: '25',
            width: '25'
          }),
          props.bookmark.name
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'card-comment' },
        comment,
        overlay && _react2.default.createElement(
          _reactBootstrap.OverlayTrigger,
          { placement: 'bottom', overlay: overlay },
          _react2.default.createElement(
            'span',
            { className: 'overlay read-more' },
            ' ...read more'
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'card-tags' },
        tags
      ),
      _react2.default.createElement(
        'div',
        { className: 'card-date' },
        new Date(props.bookmark.created).toLocaleDateString()
      ),
      buttons
    )
  );
}; /* globals window */

BookmarkRow.propTypes = {
  bookmark: _propTypes2.default.object.isRequired,
  edit: _propTypes2.default.func.isRequired,
  filterByTag: _propTypes2.default.func.isRequired,
  save: _propTypes2.default.func.isRequired,
  searchTermFn: _propTypes2.default.func.isRequired,
  showModal: _propTypes2.default.func.isRequired
};

exports.default = BookmarkRow;