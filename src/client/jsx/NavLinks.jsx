import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Logout } from './Logout.jsx'

const SearchLink = (props) => {
  const active = { backgroundColor: '#4aaeee' }
  return (
    <li>
      {props.disableSearchLink ? (
        <a onClick={props.searchToggle} style={active}>
          <Glyphicon glyph='search' /> Search
       </a>
      ) : (
        <a onClick={props.searchToggle} >
          <Glyphicon glyph='search' /> Search
         </a>
   )}
    </li>
  )
}

const TagsLink = (props) => {
  const active = { backgroundColor: '#4aaeee' }
  return (
    <li>
      {props.disableTagsLink ? (
        <a onClick={props.tagsToggle}style={active}>
          <Glyphicon glyph='cloud' /> Tag Cloud
        </a>
      ) : (
        <a onClick={props.tagsToggle}><Glyphicon glyph='cloud' /> Tag Cloud</a>
      )}
    </li>
  )
}

const NewBookmark = (props) => {
  return (
    <li>
      <Link to='/addbookmark'><Glyphicon glyph='plus' /> New Bookmark</Link>
    </li>
  )
}

const Discover = (props) => {
  const pathname = window.location.pathname
  const active = pathname === '/discover' ? { backgroundColor: '#4aaeee' } : {}
  return (
    <li>
      <Link style={active} to='/discover'><Glyphicon glyph='globe' /> Discover</Link>
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
          <NewBookmark />
          <Discover history={props.history} />
          <TagsLink
            tagsToggle={props.tagsToggle}
            disableTagsLink={props.disableTagsLink}
          />
          <SearchLink
            searchToggle={props.searchToggle}
            disableSearchLink={props.disableSearchLink}
          />
          <li><Logout /></li>
        </ul>

      if (!props.loggedIn) {
        links = null
      }
  }
  return (<div>{links}</div>)
}
