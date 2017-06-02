'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddBookmark = function (_React$Component) {
  _inherits(AddBookmark, _React$Component);

  function AddBookmark() {
    _classCallCheck(this, AddBookmark);

    var _this = _possibleConstructorReturn(this, (AddBookmark.__proto__ || Object.getPrototypeOf(AddBookmark)).call(this));

    _this.state = { bookmarks: [] };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(AddBookmark, [{
    key: 'createBookmark',
    value: function createBookmark(newBookmark) {
      var _this2 = this;

      fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookmark)
      }).then(function (response) {
        if (response.ok) {
          response.json().then(function (updatedBookmark) {
            updatedBookmark.created = new Date().getTime();
            var newBookmarks = _this2.state.bookmarks.concat(updatedBookmark);
            _this2.setState({ bookmarks: newBookmarks });
          });
        } else {
          response.json().then(function (error) {
            console.log('Failed to add issue: ' + error.message);
          });
        }
      }).catch(function (err) {
        console.log('Error in sending data to server: ' + err.message);
      });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var form = document.forms.SiteAdd;
      this.createBookmark({
        name: form.name.value,
        url: form.url.value,
        comment: form.comment.value
      });
      form.name.value = '';
      form.url.value = '';
      form.comment.value = '';
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'form',
          { action: '/', name: 'SiteAdd', onSubmit: this.handleSubmit },
          _react2.default.createElement('input', { type: 'text', name: 'name', placeholder: 'Name' }),
          _react2.default.createElement('input', { type: 'text', name: 'url', placeholder: 'Url' }),
          _react2.default.createElement('input', { type: 'text', name: 'comment', placeholder: 'Comment' }),
          _react2.default.createElement('input', { type: 'checkbox', name: 'private', value: 'private' }),
          _react2.default.createElement(
            'button',
            null,
            'Add'
          )
        )
      );
    }
  }]);

  return AddBookmark;
}(_react2.default.Component);

exports.default = AddBookmark;