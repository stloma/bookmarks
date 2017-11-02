'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals fetch, document */

var EditBookmark = function (_React$Component) {
  _inherits(EditBookmark, _React$Component);

  function EditBookmark(props) {
    _classCallCheck(this, EditBookmark);

    var _this = _possibleConstructorReturn(this, (EditBookmark.__proto__ || Object.getPrototypeOf(EditBookmark)).call(this, props));

    _this.handleInputChange = function (event) {
      var target = event.target;
      var value = target.value;
      var name = target.name;

      _this.setState(_defineProperty({}, name, value));
    };

    _this.handleSubmit = function (event) {
      event.preventDefault();
      var form = document.forms.SiteAdd;

      // Remove duplicate tags
      var tags = new Set(form.tags.value.split(' '));
      var unique = '';
      tags.forEach(function (tag) {
        unique += ' ' + tag;
      });
      tags = unique.trim();

      _this.editBookmark({
        _id: _this.state._id,
        name: form.name.value,
        url: form.url.value,
        comment: form.comment.value,
        tags: tags
      });
    };

    _this.cancel = function () {
      _this.props.history.goBack();
    };

    var bookmark = _this.props.location.state.bookmark;


    _this.state = {
      _id: bookmark._id,
      name: bookmark.name,
      url: bookmark.url,
      comment: bookmark.comment,
      tags: bookmark.tags
    };
    return _this;
  }

  _createClass(EditBookmark, [{
    key: 'editBookmark',
    value: async function editBookmark(bookmark) {
      var _this2 = this;

      try {
        var response = await fetch('/api/bookmarks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookmark),
          credentials: 'include'
        });
        if (response.ok) {
          this.props.history.push('/');
        } else {
          response.json().then(function (errors) {
            _this2.props.alert({ messages: errors, type: 'danger' });
          });
        }
      } catch (error) {
        this.props.alert({ messages: 'Failed editing bookmark: ' + error, type: 'danger' });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'pattern' },
        _react2.default.createElement(
          'div',
          { className: 'container well', id: 'editbookmark' },
          _react2.default.createElement(
            'form',
            { name: 'SiteAdd', onSubmit: this.handleSubmit },
            _react2.default.createElement(
              'fieldset',
              null,
              _react2.default.createElement(
                'legend',
                null,
                'Edit Bookmark'
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'name' },
                  'Name:'
                ),
                _react2.default.createElement('input', {
                  onChange: this.handleInputChange,
                  value: this.state.name,
                  autoFocus: true,
                  type: 'text',
                  className: 'form-control ',
                  name: 'name',
                  id: 'name'
                }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'url' },
                  'Url:'
                ),
                _react2.default.createElement('input', {
                  onChange: this.handleInputChange,
                  value: this.state.url,
                  type: 'text',
                  className: 'form-control',
                  name: 'url',
                  id: 'url'
                }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'comment' },
                  'Comment:'
                ),
                _react2.default.createElement('input', {
                  onChange: this.handleInputChange,
                  value: this.state.comment,
                  type: 'text',
                  className: 'form-control',
                  name: 'comment',
                  id: 'comment'
                }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'tags' },
                  'Tags:'
                ),
                _react2.default.createElement('input', {
                  onChange: this.handleInputChange,
                  value: this.state.tags || '',
                  type: 'text',
                  className: 'form-control',
                  name: 'tags',
                  id: 'tags',
                  placeholder: 'Space separated (e.g., personal banking finance)'
                }),
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
                )
              )
            )
          )
        )
      );
    }
  }]);

  return EditBookmark;
}(_react2.default.Component);

exports.default = EditBookmark;


EditBookmark.propTypes = {
  history: _propTypes2.default.object.isRequired,
  location: _propTypes2.default.object.isRequired,
  alert: _propTypes2.default.func.isRequired
};