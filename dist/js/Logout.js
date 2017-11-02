'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactBootstrap = require('react-bootstrap');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logout = function Logout(props) {
  var logout = async function logout(event) {
    event.preventDefault();
    window.location.replace('/login');
    var fetchData = {
      method: 'GET',
      credentials: 'include'
    };
    try {
      var response = await fetch('/api/logout', fetchData);
      if (response.status === 401) {
        props.alert({ messages: 'You must be logged in to access this page', type: 'warning' });
      } else if (response.status !== 200) {
        props.alert({ messages: 'Logout error: ' + response.status, type: 'danger' });
      } else {
        props.alert({ messages: 'logged out', type: 'success' });
      }
    } catch (error) {
      props.alert({ messages: 'Logout failure: ' + error, type: 'danger' });
    }
  };

  return _react2.default.createElement(
    'a',
    { onClick: logout },
    _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'log-out' }),
    ' Logout'
  );
}; /* globals fetch, window */

Logout.propTypes = {
  alert: _propTypes2.default.func.isRequired
};

exports.default = Logout;