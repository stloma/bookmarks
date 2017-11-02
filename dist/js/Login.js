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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals fetch, window */

var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login() {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this));

    _this.handleInputChange = function (event) {
      var target = event.target;
      var value = target.value;
      var name = target.name;

      _this.setState(_defineProperty({}, name, value));
    };

    _this.handleSubmit = async function (event) {
      event.preventDefault();
      var data = 'username=' + _this.state.username + '&password=' + _this.state.password;
      var fetchData = {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: data
      };
      try {
        var response = await fetch('/api/login', fetchData);
        if (response.ok) {
          window.location.replace('/');
        } else if (response.status === 401) {
          _this.props.alert({ messages: 'Username or password incorrect', type: 'danger' });
        } else if (response.status === 400) {
          _this.props.alert({ messages: 'Please enter a username and password', type: 'danger' });
        } else {
          _this.props.alert({ messages: 'Login failed with code: ' + response.status, type: 'danger' });
        }
      } catch (error) {
        _this.props.alert({ messages: 'Login failed: ' + error, type: 'danger' });
      }
    };

    _this.state = {
      username: '',
      password: ''
    };
    return _this;
  }

  _createClass(Login, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'pattern' },
        _react2.default.createElement(
          'div',
          { className: 'container well', id: 'login' },
          _react2.default.createElement(
            'form',
            { method: 'POST', action: '/api/login', name: 'Login', onSubmit: this.handleSubmit },
            _react2.default.createElement(
              'fieldset',
              null,
              _react2.default.createElement(
                'legend',
                null,
                'Login'
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'username' },
                  'Username:'
                ),
                _react2.default.createElement('input', {
                  autoFocus: true,
                  onChange: this.handleInputChange,
                  onSubmit: this.handleSubmit,
                  type: 'text',
                  className: 'form-control',
                  name: 'username',
                  value: this.state.username,
                  placeholder: 'username',
                  id: 'username'
                }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'password' },
                  'Password:'
                ),
                _react2.default.createElement('input', {
                  onChange: this.handleInputChange,
                  type: 'password',
                  className: 'form-control',
                  name: 'password',
                  placeholder: 'password',
                  id: 'password'
                }),
                _react2.default.createElement(
                  'div',
                  { className: 'form-group' },
                  _react2.default.createElement(
                    'div',
                    { className: 'form-button' },
                    _react2.default.createElement(
                      'button',
                      { type: 'submit', className: 'btn btn-primary' },
                      'Submit'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'center-text' },
                'Don\'t have an account?  ',
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { to: '/register' },
                  'Register'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Login;
}(_react2.default.Component);

exports.default = Login;


Login.propTypes = {
  alert: _propTypes2.default.func.isRequired
};