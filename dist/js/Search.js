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

var Search = function Search(props) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_reactBootstrap.Glyphicon, { id: 'remove-search', onClick: props.clearSearch, glyph: 'remove' }),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('input', { autoFocus: true, value: props.searchTerm, onChange: function onChange(e) {
          return props.searchTermFn(e);
        }, type: 'text', placeholder: 'Search' })
    )
  );
};

Search.propTypes = {
  clearSearch: _propTypes2.default.func.isRequired,
  searchTermFn: _propTypes2.default.func.isRequired,
  searchTerm: _propTypes2.default.string.isRequired
};

exports.default = Search;