'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactBootstrap = require('react-bootstrap');

var _reactRouterDom = require('react-router-dom');

var _lodash = require('lodash');

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _BookmarkRow = require('./BookmarkRow');

var _BookmarkRow2 = _interopRequireDefault(_BookmarkRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals fetch, window */

// Lookup table for types of sorts; selected by dropdown
var sortLookup = {
  '1': { by: 'name', order: 'desc', title: 'Name (a-z)' },
  '2': { by: 'name', order: 'asc', title: 'Name (z-a)' },
  '3': { by: 'created', order: 'asc', title: 'Newest' },
  '4': { by: 'created', order: 'desc', title: 'Oldest' }
};

// Filter duplicates if sorting by name
function noDupsByName(bookmarks) {
  var noDups = [];
  var keys = void 0;
  bookmarks.forEach(function (bookmark) {
    if (!keys) {
      keys = bookmark;
      noDups.push(bookmark);
    } else if (keys.url !== bookmark.url) {
      noDups.push(bookmark);
      keys = bookmark;
    }
  });
  return noDups;
}

// Filter duplicates if sorting by date
function noDupsByDate(bookmarks) {
  var noDups = [];
  for (var i = 0; i < bookmarks.length; i += 1) {
    var seen = false;
    for (var j = i + 1; j < bookmarks.length; j += 1) {
      if (bookmarks[i].url === bookmarks[j].url) {
        seen = true;
      }
    }
    if (!seen) {
      noDups.push(bookmarks[i]);
    }
  }
  return noDups;
}

var BookmarkTable = function (_React$Component) {
  _inherits(BookmarkTable, _React$Component);

  function BookmarkTable() {
    _classCallCheck(this, BookmarkTable);

    var _this = _possibleConstructorReturn(this, (BookmarkTable.__proto__ || Object.getPrototypeOf(BookmarkTable)).call(this));

    _this.showModal = function (id, name) {
      _this.setState({ showModal: { id: id, name: name } });
    };

    _this.closeModal = function () {
      _this.setState({ showModal: false });
    };

    _this.confirmDelete = function () {
      _this.props.onDeleteClick(_this.state.showModal.id);
      _this.setState({ showModal: false });
    };

    _this.filterByTag = function (tag) {
      _this.setState({ filterByTag: tag });
    };

    _this.clearTags = function () {
      _this.setState({ filterByTag: '' });
    };

    _this.sort = function (e) {
      var sortBy = void 0;
      switch (e) {
        case '2':
          sortBy = sortLookup['2'];
          break;
        case '3':
          sortBy = sortLookup['3'];
          break;
        case '4':
          sortBy = sortLookup['4'];
          break;
        default:
          sortBy = sortLookup['1'];
      }

      var _sortBy2 = sortBy,
          by = _sortBy2.by,
          order = _sortBy2.order,
          title = _sortBy2.title;


      _this.setState({
        sortOrder: order,
        sortBy: by,
        sortTitle: title
      });
    };

    _this.edit = function (bookmark) {
      _this.setState({ editBookmark: bookmark });
    };

    _this.save = async function (bookmark) {
      var newBookmark = Object.assign({}, bookmark);
      delete newBookmark._id;
      delete newBookmark.createdBy;
      try {
        var response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBookmark),
          credentials: 'include'
        });
        if (response.ok) {
          _this.props.alert({ messages: 'Save successful!', type: 'success' });
        } else {
          var errors = await response.json();
          _this.props.alert({ messages: 'Save failed: ' + errors, type: 'danger' });
        }
      } catch (error) {
        _this.props.alert({ messages: 'Error saving bookmark: ' + error, type: 'danger' });
      }
    };

    _this.state = {
      showModal: false,
      filterByTag: '',
      editBookmark: false,
      sortBy: 'name',
      sortOrder: 'desc',
      sortTitle: 'Name (a-z)'
    };
    return _this;
  }

  _createClass(BookmarkTable, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.state.editBookmark) {
        return _react2.default.createElement(_reactRouterDom.Redirect, {
          push: true,
          to: {
            pathname: '/editbookmark',
            state: { bookmark: this.state.editBookmark }
          }
        });
      }

      // Setup filtering
      var _props = this.props,
          searchTerm = _props.searchTerm,
          propsFilterByTag = _props.filterByTag;
      var stateFilterByTag = this.state.filterByTag;

      var filter = [searchTerm, propsFilterByTag, stateFilterByTag].find(Boolean) || '';

      // Setup sorting
      var _state = this.state,
          sortBy = _state.sortBy,
          sortOrder = _state.sortOrder;
      var sortTitle = this.state.sortTitle;


      sortTitle = _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          'b',
          null,
          'Sort By: '
        ),
        _react2.default.createElement(
          'span',
          { id: 'sort-by' },
          sortTitle
        )
      );

      var sorted = (0, _lodash.sortBy)(this.props.bookmarks, sortBy, sortOrder);

      // Remove duplicates if in /discover since it's pulling all users'
      // bookmarks. Two functions so it can get O(n) when sorting by name, rather
      // than the O(n^2) sorting by date requires
      if (window.location.pathname === '/discover') {
        if (sortBy === 'name') {
          sorted = noDupsByName(sorted);
        } else if (sortBy === 'created') {
          sorted = noDupsByDate(sorted);
        }
      }

      if (sortOrder === 'asc') {
        sorted.reverse();
      }

      var bookmarkRows = sorted.filter(function (bookmark) {
        return (bookmark.name + ' ' + bookmark.url + ' ' + bookmark.comment + ' ' + bookmark.tags + ' ' + bookmark.createdBy).toUpperCase().indexOf(filter.toUpperCase()) >= 0;
      }).map(function (bookmark) {
        return _react2.default.createElement(_BookmarkRow2.default, {
          key: bookmark._id,
          showModal: _this2.showModal,
          filterByTag: _this2.filterByTag,
          edit: _this2.edit,
          save: _this2.save,
          bookmark: bookmark,
          searchTermFn: _this2.props.searchTermFn
        });
      });

      var tagHeading = void 0;
      if (this.state.filterByTag) {
        tagHeading = _react2.default.createElement(
          'button',
          { onClick: this.clearTags, className: 'btn btn-default' },
          _react2.default.createElement(
            'b',
            null,
            'Clear tags'
          )
        );
      }

      return _react2.default.createElement(
        'div',
        null,
        this.state.showModal && _react2.default.createElement(_Modal2.default, {
          modalTitle: this.state.showModal,
          showModal: true,
          closeModal: this.closeModal,
          confirmDelete: this.confirmDelete
        }),
        _react2.default.createElement(
          'div',
          { className: 'container', id: 'display-controls' },
          _react2.default.createElement(
            'div',
            { id: 'clear-tags' },
            tagHeading
          ),
          _react2.default.createElement(
            _reactBootstrap.DropdownButton,
            { onSelect: this.sort, title: sortTitle, id: 'bg-nested-dropdown' },
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '1' },
              'Name (a-z)'
            ),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '2' },
              'Name (z-a)'
            ),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '3' },
              'Newest'
            ),
            _react2.default.createElement(
              _reactBootstrap.MenuItem,
              { eventKey: '4' },
              'Oldest'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { id: 'cards', className: 'container' },
          _react2.default.createElement(
            'div',
            { className: 'row' },
            bookmarkRows
          )
        )
      );
    }
  }]);

  return BookmarkTable;
}(_react2.default.Component);

exports.default = BookmarkTable;


BookmarkTable.propTypes = {
  bookmarks: _propTypes2.default.array.isRequired,
  filterByTag: _propTypes2.default.string.isRequired,
  onDeleteClick: _propTypes2.default.func.isRequired,
  alert: _propTypes2.default.func.isRequired,
  searchTerm: _propTypes2.default.string.isRequired,
  searchTermFn: _propTypes2.default.func.isRequired
};