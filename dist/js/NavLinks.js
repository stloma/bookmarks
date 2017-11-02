'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactBootstrap = require('react-bootstrap');

var _reactRouterDom = require('react-router-dom');

var _Logout = require('./Logout');

var _Logout2 = _interopRequireDefault(_Logout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchLink = function SearchLink(props) {
  var active = { backgroundColor: '#4aaeee' };
  return _react2.default.createElement(
    'li',
    null,
    props.disableSearchLink ? _react2.default.createElement(
      'a',
      { onClick: props.searchToggle, style: active },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'search' }),
      ' Search'
    ) : _react2.default.createElement(
      'a',
      { onClick: props.searchToggle },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'search' }),
      ' Search'
    )
  );
}; /* globals window */

SearchLink.propTypes = {
  disableSearchLink: _propTypes2.default.bool.isRequired,
  searchToggle: _propTypes2.default.func.isRequired
};

var TagsLink = function TagsLink(props) {
  var active = { backgroundColor: '#4aaeee' };
  return _react2.default.createElement(
    'li',
    null,
    props.disableTagsLink ? _react2.default.createElement(
      'a',
      { onClick: props.tagsToggle, style: active },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'cloud' }),
      ' Tag Cloud'
    ) : _react2.default.createElement(
      'a',
      { onClick: props.tagsToggle },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'cloud' }),
      ' Tag Cloud'
    )
  );
};

TagsLink.propTypes = {
  disableTagsLink: _propTypes2.default.bool.isRequired,
  tagsToggle: _propTypes2.default.func.isRequired
};

var NewBookmark = function NewBookmark() {
  return _react2.default.createElement(
    'li',
    null,
    _react2.default.createElement(
      _reactRouterDom.Link,
      { to: '/addbookmark' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'plus' }),
      ' New Bookmark'
    )
  );
};

var Discover = function Discover() {
  var pathname = window.location.pathname;
  var active = pathname === '/discover' ? { backgroundColor: '#4aaeee' } : {};
  return _react2.default.createElement(
    'li',
    null,
    _react2.default.createElement(
      _reactRouterDom.Link,
      { style: active, to: '/discover' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'globe' }),
      ' Discover'
    )
  );
};

var NavLinks = function NavLinks(props) {
  var pathname = window.location.pathname;
  var links = void 0;
  switch (pathname) {
    case '/addbookmark':
    case '/editbookmark':
      links = _react2.default.createElement(
        'ul',
        { className: 'nav navbar-nav navbar-right' },
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(_Logout2.default, { alert: props.alert })
        )
      );
      break;
    case '/login':
      links = null;
      break;
    case '/register':
      links = _react2.default.createElement(
        'ul',
        { className: 'nav navbar-nav navbar-right' },
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouterDom.Link,
            { to: '/login' },
            'Login'
          )
        )
      );
      break;
    default:
      links = _react2.default.createElement(
        'ul',
        { className: 'nav navbar-nav navbar-right' },
        _react2.default.createElement(NewBookmark, null),
        _react2.default.createElement(Discover, null),
        _react2.default.createElement(TagsLink, {
          tagsToggle: props.tagsToggle,
          disableTagsLink: props.disableTagsLink
        }),
        _react2.default.createElement(SearchLink, {
          searchToggle: props.searchToggle,
          disableSearchLink: props.disableSearchLink
        }),
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(_Logout2.default, { alert: props.alert })
        )
      );

      if (!props.loggedIn) {
        links = null;
      }
  }
  return _react2.default.createElement(
    'div',
    null,
    links
  );
};

NavLinks.propTypes = {
  disableSearchLink: _propTypes2.default.bool.isRequired,
  disableTagsLink: _propTypes2.default.bool.isRequired,
  loggedIn: _propTypes2.default.bool.isRequired,
  tagsToggle: _propTypes2.default.func.isRequired,
  searchToggle: _propTypes2.default.func.isRequired,
  alert: _propTypes2.default.func.isRequired
};

exports.default = NavLinks;