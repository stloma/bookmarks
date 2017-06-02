'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function BookmarkTable(props) {
  var bookmarkRows = props.bookmarks.map(function (bookmark) {
    return _react2.default.createElement(BookmarkRow, { key: bookmark._id, bookmark: bookmark });
  });
  return _react2.default.createElement(
    'table',
    { className: 'bordered-table' },
    _react2.default.createElement(
      'thead',
      null,
      _react2.default.createElement(
        'tr',
        null,
        _react2.default.createElement(
          'th',
          null,
          'Id'
        ),
        _react2.default.createElement(
          'th',
          null,
          'Name'
        ),
        _react2.default.createElement(
          'th',
          null,
          'Url'
        ),
        _react2.default.createElement(
          'th',
          null,
          'Created'
        ),
        _react2.default.createElement(
          'th',
          null,
          'Comment'
        ),
        _react2.default.createElement(
          'th',
          null,
          'Tags'
        ),
        _react2.default.createElement(
          'th',
          null,
          'Delete'
        )
      )
    ),
    _react2.default.createElement(
      'tbody',
      null,
      bookmarkRows
    )
  );
}

var BookmarkRow = function BookmarkRow(props) {
  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement(
        _reactRouterDom.Link,
        { to: '/bookmarks/' + props.bookmark._id },
        props.bookmark._id.substr(-4)
      )
    ),
    _react2.default.createElement(
      'td',
      null,
      props.bookmark.name
    ),
    _react2.default.createElement(
      'td',
      null,
      props.bookmark.url
    ),
    _react2.default.createElement(
      'td',
      null,
      new Date(props.bookmark.created).toString()
    ),
    _react2.default.createElement(
      'td',
      null,
      props.bookmark.comment
    ),
    _react2.default.createElement(
      'td',
      null,
      props.bookmark.tags
    ),
    _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement(
        _reactRouterDom.Link,
        { to: '/deletebookmark/' + props.bookmark._id },
        'X'
      )
    )
  );
};

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this.state = { bookmarks: [] };
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadData();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var oldQuery = prevProps.location.search;
      var newQuery = this.props.location.search;

      if (oldQuery === newQuery) {
        return;
      }
      this.loadData();
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      var _this2 = this;

      fetch('/api/bookmarks').then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('Total count of records: ', data._metadata.total_count);
            _this2.setState({ bookmarks: data.records });
          });
        } else {
          response.json().then(function (error) {
            console.log('Failed to fetch issues: ' + error.message);
          });
        }
      }).catch(function (err) {
        console.log('Error in fetching data from server: ', err);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(BookmarkTable, { bookmarks: this.state.bookmarks })
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;