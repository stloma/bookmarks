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

var Alerts = function Alerts(props) {
  // Avoids eslint no-unused-prop-types false positives on stateless functional components
  var clearAlert = props.clearAlert;

  return _react2.default.createElement(
    'div',
    { className: 'error' },
    props.alerts.messages.map(function (alert) {
      return _react2.default.createElement(
        _reactBootstrap.Alert,
        { key: alert, bsStyle: props.alerts.type, onDismiss: function onDismiss() {
            return clearAlert(alert);
          } },
        _react2.default.createElement(
          'h4',
          null,
          alert
        )
      );
    })
  );
};

Alerts.propTypes = {
  alerts: _propTypes2.default.object.isRequired,
  clearAlert: _propTypes2.default.func.isRequired
};

exports.default = Alerts;