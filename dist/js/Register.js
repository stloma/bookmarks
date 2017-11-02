'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals fetch, document */

var Register = function (_React$Component) {
  _inherits(Register, _React$Component);

  function Register() {
    _classCallCheck(this, Register);

    var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this));

    _this.createUser = async function (newUser) {
      try {
        var response = await fetch('/api/registeruser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
        if (response.ok) {
          _this.props.history.push('/');
        } else {
          var alerts = await response.json();
          _this.props.alert({ messages: alerts, type: 'danger' });
        }
      } catch (error) {
        _this.props.alert({ messages: 'Error in creating user: ' + error, type: 'danger' });
      }
    };

    _this.handleSubmit = function (event) {
      event.preventDefault();
      var form = document.forms.UserAdd;
      if (form.password.value !== form.password2.value) {
        _this.props.alert({ messages: 'Passwords do not match. Please try again', type: 'danger' });
      } else {
        _this.createUser({
          username: form.username.value,
          password: form.password.value
        });
      }
    };

    _this.cancel = function () {
      _this.props.history.goBack();
    };

    _this.state = {
      user: []
    };
    return _this;
  }

  _createClass(Register, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'pattern' },
        _react2.default.createElement(
          'div',
          { className: 'container well', id: 'register' },
          _react2.default.createElement(
            'form',
            { method: 'post', name: 'UserAdd', onSubmit: this.handleSubmit },
            _react2.default.createElement(
              'fieldset',
              null,
              _react2.default.createElement(
                'legend',
                null,
                'Register'
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'username', className: 'control-label' },
                  'Username'
                ),
                _react2.default.createElement('input', {
                  type: 'text',
                  className: 'form-control',
                  name: 'username',
                  id: 'username',
                  placeholder: 'Username/Email'
                }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'password', className: 'control-label' },
                  'Password'
                ),
                _react2.default.createElement('input', {
                  type: 'password',
                  className: 'form-control',
                  name: 'password',
                  id: 'password',
                  placeholder: 'Password'
                }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'password2', className: 'control-label' },
                  'Re-enter password'
                ),
                _react2.default.createElement('input', {
                  type: 'password',
                  className: 'form-control',
                  name: 'password2',
                  id: 'password2',
                  placeholder: 'Password'
                }),
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                  'div',
                  { className: 'form-group' },
                  _react2.default.createElement(
                    'div',
                    { className: 'form-button' },
                    _react2.default.createElement(
                      'button',
                      { onClick: this.cancel, type: 'reset', className: 'btn btn-default' },
                      'Cancel'
                    ),
                    _react2.default.createElement(
                      'button',
                      { type: 'submit', className: 'btn btn-primary' },
                      'Submit'
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'center-text' },
                  'Already have an account?  ',
                  _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: '/login' },
                    'Login'
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Register;
}(_react2.default.Component);

exports.default = Register;


Register.propTypes = {
  history: _propTypes2.default.object.isRequired,
  alert: _propTypes2.default.func.isRequired
};