import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { Logout } from './Logout.jsx'

export const Navigation = (props) => {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand><Link to='/'>Bookmark Manager</Link></Navbar.Brand>
      </Navbar.Header>
      <Nav />
      <Nav pullRight>
        <NavItem>
          <LinkContainer to='/addbookmark'>
            <div><Glyphicon glyph='plus' /> New Bookmark</div>
          </LinkContainer>
        </NavItem>
        <NavItem>
          <div onClick={props.showTags}><Glyphicon glyph='cloud' /> Tag Cloud</div>
        </NavItem>
        <NavItem>
          <div onClick={props.showSearch}><Glyphicon glyph='search' /> Search</div>
        </NavItem>
        <NavDropdown id='user-dropdown' title={<Glyphicon glyph='option-horizontal' />} noCaret>
          <MenuItem><Logout /></MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar>
  )
}
