/* globals window */

import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Button, Glyphicon, OverlayTrigger } from 'react-bootstrap'

const BookmarkRow = (props) => {
  const trash = (
    <Tooltip id='modal-tooltip'>
      Delete
    </Tooltip>
  )
  const edit = (
    <Tooltip id='modal-tooltip'>
      Edit
    </Tooltip>
  )
  const save = (
    <Tooltip id='modal-tooltip'>
      Save
    </Tooltip>
  )

  let tags
  // To avoid no-unused-prop-types linting error
  const { filterByTag } = props
  if (props.bookmark.tags) {
    tags = props.bookmark.tags.split(' ').map(tag =>
      (<a
        onClick={() => filterByTag(tag)}
        key={props.bookmark._id + tag}
        className='tag-button'
      >
        {tag}
      </a>),
    )
  }

  let { comment } = props.bookmark
  let commentOverlay
  if (comment.length > 20) {
    // Shorten displayed comment and add tooltip to see entire comment
    const tmp = comment.substr(0, 21)
    commentOverlay = comment
    comment = tmp
    commentOverlay = (<Tooltip id='comment-tooltip'>{commentOverlay}</Tooltip>)
  }

  const pathname = window.location.pathname
  let buttons
  switch (pathname) {
    case '/':
      buttons =
        (<div className='card-buttons'>
          <OverlayTrigger placement='bottom' overlay={edit} >
            <Button
              className='table-actions'
              bsSize='xsmall'
              onClick={() => props.edit(props.bookmark)}
            >
              <Glyphicon glyph='edit' />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement='bottom' overlay={trash} >
            <Button
              className='table-actions'
              bsSize='xsmall'
              onClick={() => props.showModal(props.bookmark._id, props.bookmark.name)}
            >
              <Glyphicon glyph='trash' />
            </Button>
          </OverlayTrigger>
        </div>)
      break
    case '/discover':
      buttons =
        (<div>
          <div className='card-created-by'>
            <h5>CREATED BY:</h5> {props.bookmark.createdBy}
          </div>
          <div className='card-buttons'>
            <OverlayTrigger placement='bottom' overlay={save} >
              <Button
                className='table-actions'
                bsSize='xsmall'
                onClick={() => props.save(props.bookmark)}
              >
                <Glyphicon glyph='floppy-save' />
              </Button>
            </OverlayTrigger>
          </div>
        </div>)
      break
    default:
  }

  return (
    <div className='col-md-4 col-sm-6 bookmark-card-wrapper'>
      <div className='col-sm-14 col-md-12 bookmark-card-inner'>
        <div className='card-heading'>
          <a href={props.bookmark.url} target='_blank'>
            <img
              alt={`${props.bookmark.name} favicon`}
              className='favicon'
              src={`/images/favicons/${props.bookmark.favicon}`}
              height='25'
              width='25'
            />
            {props.bookmark.name}
          </a>
        </div>
        <div className='card-comment'>
          <h5>COMMENTS:</h5> {comment}
          {commentOverlay &&
          <OverlayTrigger placement='bottom' overlay={commentOverlay} >
            <span className='overlay read-more'> ...</span>
          </OverlayTrigger>
          }
        </div>
        <div className='card-tags'>
          <h5>TAGS:</h5> {tags}
        </div>
        <div className='card-date'>
          {new Date(props.bookmark.created).toLocaleDateString()}
        </div>
        {buttons}
      </div>
    </div>
  )
}

BookmarkRow.propTypes = {
  bookmark: PropTypes.object.isRequired,
  edit: PropTypes.func.isRequired,
  filterByTag: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired
}

export default BookmarkRow
