/* globals window */

import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Logout from '../Logout/Logout'

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

SearchLink.propTypes = {
  disableSearchLink: PropTypes.bool.isRequired,
  searchToggle: PropTypes.func.isRequired
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

TagsLink.propTypes = {
  disableTagsLink: PropTypes.bool.isRequired,
  tagsToggle: PropTypes.func.isRequired
}

const NewBookmark = () => (
  <li>
    <Link to='/addbookmark'><Glyphicon glyph='plus' /> New Bookmark</Link>
  </li>
)

const ChangePassword = () => (
  <div className='dropdown-item'><Glyphicon glyph='plus' /> Change Password</div>
)

const Discover = () => {
  const pathname = window.location.pathname
  const active = pathname === '/discover' ? { backgroundColor: '#4aaeee' } : {}
  return (
    <li>
      <Link style={active} to='/discover'><Glyphicon glyph='globe' /> Discover</Link>
    </li>
  )
}

const Account = (props) => {
  const user = <span><Glyphicon glyph='user' /> Account</span>
  return (
    <div id='account-dropdown'>
      <DropdownButton title={user} id='bg-nested-dropdown'>
        <MenuItem eventKey='1'><ChangePassword /></MenuItem>
        <MenuItem eventKey='2'><Logout alert={props.alert} /></MenuItem>
      </DropdownButton>
    </div>
  )
}

Account.propTypes = {
  alert: PropTypes.func.isRequired
}

const NavLinks = (props) => {
  const pathname = window.location.pathname
  let links

  switch (pathname) {
    case '/addbookmark':
    case '/editbookmark':
      links =
        (<ul className='nav navbar-nav navbar-right'>
          <li>
            <Account alert={props.alert} />
          </li>
        </ul>)
      break
    case '/login':
      links = null
      break
    case '/register':
      links =
        (<ul className='nav navbar-nav navbar-right'>
          <li><Link to='/login'>Login</Link></li>
        </ul>)
      break
    default:
      links =
        (<ul className='nav navbar-nav navbar-right'>
          <NewBookmark />
          <Discover />
          <TagsLink
            tagsToggle={props.tagsToggle}
            disableTagsLink={props.disableTagsLink}
          />
          <SearchLink
            searchToggle={props.searchToggle}
            disableSearchLink={props.disableSearchLink}
          />
          <li>
            <Account alert={props.alert} />
          </li>
        </ul>)

      if (!props.loggedIn) {
        links = null
      }
  }
  return (<div>{links}</div>)
}

NavLinks.propTypes = {
  disableSearchLink: PropTypes.bool.isRequired,
  disableTagsLink: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  searchToggle: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired
}

export default NavLinks
