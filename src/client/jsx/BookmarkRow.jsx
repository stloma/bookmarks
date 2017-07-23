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

  return (
    <tr className='active'>
      <td>
        <a href={props.bookmark.url}>
          <img
            className='favicon' src={`/images/favicons/${props.bookmark.favicon}`}
            height='20' width='20'
        />
          {props.bookmark.name}
        </a>
      </td>
      <td>
        {tags}
      </td>
      <td>{props.bookmark.comment}</td>
      <td>{new Date(props.bookmark.created).toLocaleDateString()}</td>
      <td>
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
      </td>
    </tr>
  )
}
