import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export const Navigation = (props) => (
  <Navbar>
    <Navbar.Header>
      <LinkContainer to='/'>
        <Navbar.Brand>Bookmark Manager</Navbar.Brand>
      </LinkContainer>
    </Navbar.Header>
    <Nav />
    <Nav pullRight>
      <NavItem>
        <LinkContainer to='/addbookmark'>
          <div><Glyphicon glyph='plus' /> New Bookmark</div>
        </LinkContainer>
      </NavItem>
      <NavDropdown id='user-dropdown' title={<Glyphicon glyph='option-horizontal' />} noCaret>
        <MenuItem>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
)
