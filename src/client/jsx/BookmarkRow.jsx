import React from 'react'
import { Tooltip, Button, Glyphicon, OverlayTrigger } from 'react-bootstrap'

export const BookmarkRow = (props) => {
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
  if (props.bookmark.tags) {
    tags = props.bookmark.tags.split(' ').map(tag =>
      <button onClick={() => props.filterByTag(tag)}
        key={props.bookmark._id + tag}
        type='button' className='btn btn-xs tag-button'>
        {tag}
      </button>
        )
  }

  let comments = props.bookmark.comment
  let overlay
  if (comments.length > 20) {
    let tmp = comments.substr(0, 21)
    overlay = comments
    comments = tmp
    overlay = (<Tooltip id='comments-tooltip'>{overlay}</Tooltip>)
  }

  const pathname = window.location.pathname
  let buttons
  switch (pathname) {
    case '/':
      buttons =
        <div className='card-buttons'>
          <OverlayTrigger placement='bottom' overlay={edit} >
            <Button
              className='table-actions' bsSize='xsmall'
              onClick={() => props.edit(props.bookmark)}>
              <Glyphicon glyph='edit' />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement='bottom' overlay={trash} >
            <Button
              className='table-actions' bsSize='xsmall'
              onClick={() => props.showModal(props.bookmark._id, props.bookmark.name)}>
              <Glyphicon glyph='trash' />
            </Button>
          </OverlayTrigger>
        </div>
      break
    case '/discover':
      buttons =
        <div>
          {props.bookmark.createdBy &&
            <div onClick={() => props.searchTermFn(props.bookmark.createdBy)}>
              Created by: {props.bookmark.createdBy}
            </div>
          }
          <div className='card-buttons'>
            <OverlayTrigger placement='bottom' overlay={save} >
              <Button
                className='table-actions' bsSize='xsmall'
                onClick={() => props.save(props.bookmark)}>
                <Glyphicon glyph='floppy-save' />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
  }

  return (
    <div className='col-md-4 col-sm-6 bookmark-card-wrapper'>
      <div className='col-sm-14 col-md-12 bookmark-card-inner'>
        <div className='card-heading'>
          <a href={props.bookmark.url}>
            <img
              className='favicon' src={`/images/favicons/${props.bookmark.favicon}`}
              height='35' width='35'
        />
            {props.bookmark.name}
          </a>
        </div>
        <div className='card-comment'>
          {comments}
          {overlay &&
          <OverlayTrigger placement='bottom' overlay={overlay} >
            <span className='overlay read-more'> ...read more</span>
          </OverlayTrigger>
        }
        </div>
        <div className='card-tags'>
          {tags}
        </div>
        <div className='card-date'>
          {new Date(props.bookmark.created).toLocaleDateString()}
        </div>
        {buttons}
      </div>
    </div>
  )
}
