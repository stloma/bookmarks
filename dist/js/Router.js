'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

var _Navigation = require('./Navigation');

var _Navigation2 = _interopRequireDefault(_Navigation);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _AddBookmark = require('./AddBookmark');

var _AddBookmark2 = _interopRequireDefault(_AddBookmark);

var _Login = require('./Login');

var _Login2 = _interopRequireDefault(_Login);

var _Register = require('./Register');

var _Register2 = _interopRequireDefault(_Register);

var _Loading = require('./Loading');

var _Loading2 = _interopRequireDefault(_Loading);

var _EditBookmark = require('./EditBookmark');

var _EditBookmark2 = _interopRequireDefault(_EditBookmark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* globals fetch, document */

function isAuthenticated(cb) {
  var fetchOptions = {
    method: 'GET',
    credentials: 'include'
  };
  fetch('/api/protected', fetchOptions).then(function (response) {
    return cb(response.ok);
  });
}

var NoMatch = function NoMatch() {
  return _react2.default.createElement(
    'div',
    { className: 'container' },
    _react2.default.createElement(
      'h2',
      null,
      'Page Not Found'
    )
  );
};

var renderMergedProps = function renderMergedProps(component) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  var finalProps = Object.assign.apply(Object, [{}].concat(rest));
  return _react2.default.createElement(component, finalProps);
};

var PropsRoute = function PropsRoute(_ref) {
  var component = _ref.component,
      rest = _objectWithoutProperties(_ref, ['component']);

  return _react2.default.createElement(_reactRouterDom.Route, _extends({}, rest, {
    render: function render(routeProps) {
      return renderMergedProps(component, routeProps, rest);
    }
  }));
};

var Main = function Main(props) {
  if (props.loggedIn) {
    return _react2.default.createElement(
      _reactRouterDom.Switch,
      null,
      ['/', '/discover'].map(function (path) {
        return _react2.default.createElement(_reactRouterDom.Route, {
          key: path,
          exact: true,
          path: path,
          render: function render() {
            return _react2.default.createElement(_App2.default, {
              history: props.history,
              searchToggle: props.searchToggle,
              tagsToggle: props.tagsToggle,
              showSearch: props.showSearch,
              showTags: props.showTags,
              alert: props.alert
            });
          }
        });
      }),
      _react2.default.createElement(PropsRoute, { exact: true, path: '/addbookmark', alert: props.alert, component: _AddBookmark2.default }),
      _react2.default.createElement(PropsRoute, { exact: true, path: '/editbookmark', alert: props.alert, component: _EditBookmark2.default }),
      _react2.default.createElement(PropsRoute, { exact: true, path: '/login', alert: props.alert, component: _Login2.default }),
      _react2.default.createElement(PropsRoute, { exact: true, path: '/register', alert: props.alert, component: _Register2.default }),
      _react2.default.createElement(_reactRouterDom.Route, { path: '/deletebookmark/:id', component: _App2.default }),
      _react2.default.createElement(_reactRouterDom.Route, { path: '*', component: NoMatch })
    );
  }
  return _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    _react2.default.createElement(PropsRoute, { exact: true, path: '/register', alert: props.alert, component: _Register2.default }),
    _react2.default.createElement(PropsRoute, { exact: true, path: '/login', alert: props.alert, component: _Login2.default }),
    _react2.default.createElement(_reactRouterDom.Redirect, { from: '*', to: '/login' })
  );
};

Main.propTypes = {
  loggedIn: _propTypes2.default.bool.isRequired,
  alert: _propTypes2.default.func.isRequired
};

var Container = function (_React$Component) {
  _inherits(Container, _React$Component);

  function Container() {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

    _this.loadingToggle = function () {
      _this.setState({ loading: !_this.state.loading });
    };

    _this.tagsToggle = function () {
      _this.setState({ showSearch: false });
      _this.setState({ showTags: !_this.state.showTags });
    };

    _this.searchToggle = function () {
      _this.setState({ showTags: false });
      _this.setState({ showSearch: !_this.state.showSearch });
    };

    _this.clearAlert = function (alert) {
      var alerts = _this.state.alerts;
      alerts.messages = alerts.messages.filter(function (message) {
        return message !== alert;
      });
      _this.setState({ alerts: alerts });
    };

    _this.alert = function (alerts) {
      if (alerts.messages instanceof Array) {
        _this.setState({ alerts: alerts });
      } else {
        var message = alerts;
        message.messages = [message.messages];
        _this.setState({ alerts: message });
      }
    };

    _this.state = {
      showTags: false,
      showSearch: false,
      loggedIn: false,
      alerts: { messages: '', type: '' },
      loading: true
    };
    return _this;
  }

  _createClass(Container, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      isAuthenticated(function (loggedIn) {
        if (loggedIn) {
          _this2.setState({ loggedIn: true, loading: false });
        } else {
          _this2.setState({ loggedIn: false, loading: false });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var history = this.props.history;


      if (this.state.loading) {
        return _react2.default.createElement(_Loading2.default, null);
      }
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Navigation2.default, {
          tagsToggle: this.tagsToggle,
          searchToggle: this.searchToggle,
          disableTagsLink: this.state.showTags,
          disableSearchLink: this.state.showSearch,
          loggedIn: this.state.loggedIn,
          clearAlert: this.clearAlert,
          alerts: this.state.alerts,
          alert: this.alert
        }),
        _react2.default.createElement(Main, {
          loggedIn: this.state.loggedIn,
          loadingToggle: this.loadingToggle,
          showTags: this.state.showTags,
          showSearch: this.state.showSearch,
          searchToggle: this.searchToggle,
          tagsToggle: this.tagsToggle,
          history: history,
          alert: this.alert
        }),
        _react2.default.createElement(_Footer2.default, null)
      );
    }
  }]);

  return Container;
}(_react2.default.Component);

Container.propTypes = {
  history: _propTypes2.default.object.isRequired
};

var ContainerWithRouter = (0, _reactRouterDom.withRouter)(Container);
var contentNode = document.querySelector('#root');

_reactDom2.default.render(_react2.default.createElement(
  _reactRouterDom.BrowserRouter,
  null,
  _react2.default.createElement(ContainerWithRouter, null)
), contentNode);

if (module.hot) {
  module.hot.accept();
}