import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Logout } from './Logout.jsx'

const SearchLink = (props) => {
  return (
    <li>
      {props.disableSearchLink ? (
        <a className='btn btn-info disabled'>
          <Glyphicon glyph='search' /> Search
       </a>
      ) : (
        <a onClick={props.showSearch} className='btn'>
          <Glyphicon glyph='search' /> Search
         </a>
   )}
    </li>
  )
}

const TagsLink = (props) => {
  return (
    <li>
      {props.disableTagsLink ? (
        <a className='btn btn-info disabled'>
          <Glyphicon glyph='cloud' /> Tag Cloud
        </a>
      ) : (
        <a onClick={props.showTags} className='btn'><Glyphicon glyph='cloud' /> Tag Cloud</a>
      )}
    </li>
  )
}

const NewBookmark = (props) => {
  return (
    <li>
      <Link className='btn' to='/addbookmark'><Glyphicon glyph='plus' /> New Bookmark</Link>
    </li>
  )
}

const Discover = (props) => {
  return (
    <li>
      <a href='#'><Glyphicon glyph='globe' /> Discover</a>
    </li>
  )
}

export const NavLinks = (props) => {
  const pathname = window.location.pathname
  let links
  switch (pathname) {
    case '/addbookmark':
    case '/editbookmark':
      links =
        <ul className='nav navbar-nav navbar-right'>
          <li><Logout /></li>
        </ul>
      break
    case '/login':
      links = null
      break
    case '/register':
      links =
        <ul className='nav navbar-nav navbar-right'>
          <li><Link to='/login'>Login</Link></li>
        </ul>
      break
    default:
      links =
        <ul className='nav navbar-nav navbar-right'>
          <Discover />
          <NewBookmark />
          <TagsLink showTags={props.showTags} disableTagsLink={props.disableTagsLink} />
          <SearchLink showSearch={props.showSearch} disableSearchLink={props.disableSearchLink} />
          <li><Logout /></li>
        </ul>

      if (!props.loggedIn) {
        links = null
      }
  }
  return (<div>{links}</div>)
}
