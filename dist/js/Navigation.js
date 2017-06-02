'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigation = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Navigation = exports.Navigation = function Navigation(props) {
  return _react2.default.createElement(
    'div',
    { className: 'header' },
    _react2.default.createElement(
      _reactRouterDom.Link,
      { to: '/' },
      'Home'
    ),
    _react2.default.createElement(
      _reactRouterDom.Link,
      { to: '/addbookmark' },
      'Addbookmark'
    ),
    _react2.default.createElement(
      'h3',
      null,
      'Navbar placeholder'
    )
  );
};