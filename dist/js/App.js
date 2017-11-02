'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTagcloud = require('react-tagcloud');

var _reactBootstrap = require('react-bootstrap');

var _Search = require('./Search');

var _Search2 = _interopRequireDefault(_Search);

var _BookmarkTable = require('./BookmarkTable');

var _BookmarkTable2 = _interopRequireDefault(_BookmarkTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global fetch, window */

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this.onDeleteClick = async function (id) {
      var fetchData = {
        method: 'DELETE',
        credentials: 'include'
      };
      var response = await fetch('/api/bookmarks/' + id, fetchData);
      if (!response.ok) {
        _this.props.alert({ messages: 'Failed to delete bookmark: ' + id, type: 'danger' });
      } else {
        _this.loadData();
      }
    };

    _this.loadData = async function () {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'bookmarks';

      var fetchData = {
        method: 'GET',
        credentials: 'include'
      };

      try {
        var response = await fetch('/api/' + path, fetchData);
        if (response.ok) {
          var data = await response.json();
          _this.setState({
            bookmarks: data.records,
            tagcount: data.tagcount
          });
        } else {
          var error = await response.json();
          _this.props.alert({ messages: 'Failed to download bookmarks: ' + error, type: 'danger' });
        }
      } catch (error) {
        _this.props.alert({ messages: 'Error in fetching data from server: ' + error, type: 'danger' });
      }
    };

    _this.searchTerm = function (event) {
      if (!event.target) {
        _this.props.searchToggle();
        _this.setState({ searchTerm: event });
      } else {
        _this.setState({ searchTerm: event.target.value });
      }
    };

    _this.filterByTag = function (event) {
      _this.setState({ filterByTag: event.value });
    };

    _this.clearTagFilter = function () {
      _this.setState({ filterByTag: '' });
      _this.props.tagsToggle();
    };

    _this.clearSearch = function () {
      _this.setState({ searchTerm: '' });
      _this.props.searchToggle();
    };

    _this.state = {
      bookmarks: [],
      tagcount: [],
      searchTerm: '',
      filterByTag: ''
    };
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // if /, load personal bookmarks. if discover, load everyone else's
      var location = window.location.pathname;
      if (location === '/') {
        this.loadData('bookmarks');
      } else if (location === '/discover') {
        this.loadData('discover');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var options = {
        luminosity: 'light',
        format: 'rgb',
        disableRandomColor: true
      };

      return _react2.default.createElement(
        'div',
        { id: 'pattern' },
        _react2.default.createElement(
          'div',
          { className: 'container' },
          this.props.showTags && _react2.default.createElement(
            'div',
            { className: 'well', id: 'tagcloud' },
            _react2.default.createElement(_reactBootstrap.Glyphicon, { id: 'remove-search', onClick: this.clearTagFilter, glyph: 'remove' }),
            _react2.default.createElement(_reactTagcloud.TagCloud, {
              minSize: 14,
              maxSize: 46,
              colorOptions: options,
              className: 'simple-cloud',
              tags: this.state.tagcount,
              onClick: this.filterByTag,
              shuffle: false
            })
          ),
          this.props.showSearch && _react2.default.createElement(
            'div',
            { id: 'search' },
            _react2.default.createElement(_Search2.default, {
              clearSearch: this.clearSearch,
              searchTermFn: this.searchTerm,
              searchTerm: this.state.searchTerm
            })
          ),
          _react2.default.createElement(_BookmarkTable2.default, {
            bookmarks: this.state.bookmarks,
            onDeleteClick: this.onDeleteClick,
            searchTerm: this.state.searchTerm,
            searchTermFn: this.searchTerm,
            filterByTag: this.state.filterByTag,
            alert: this.props.alert
          })
        )
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;


App.propTypes = {
  searchToggle: _propTypes2.default.func.isRequired,
  tagsToggle: _propTypes2.default.func.isRequired,
  alert: _propTypes2.default.func.isRequired,
  showSearch: _propTypes2.default.bool.isRequired,
  showTags: _propTypes2.default.bool.isRequired
};