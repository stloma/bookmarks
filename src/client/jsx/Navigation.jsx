import React from 'react'
import { Link } from 'react-router-dom'
import { NavLinks } from './NavLinks.jsx'

export class Navigation extends React.Component {
  constructor () {
    super()

    this.state = ({
      navCollapsed: true
    })
    this.toggleNavCollapse = this.toggleNavCollapse.bind(this)
  }

  toggleNavCollapse () {
    this.setState({ navCollapsed: !this.state.navCollapsed })
  }

  render () {
    const { navCollapsed } = this.state
    const { loggedIn, tagsToggle, searchToggle, disableSearchLink, disableTagsLink } = this.props

    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/'>
              <span id='logo'>Bookmark Manager</span>
            </Link>
            <button
              aria-expanded='false'
              className='navbar-toggle collapsed'
              onClick={this.toggleNavCollapse}
              type='button'
            >
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar' />
              <span className='icon-bar' />
              <span className='icon-bar' />
            </button>
          </div>
          <div className={(navCollapsed ? 'collapse' : '') + ' navbar-collapse'} >
            <NavLinks
              history={this.props.history}
              tagsToggle={tagsToggle}
              disableTagsLink={disableTagsLink}
              searchToggle={searchToggle}
              disableSearchLink={disableSearchLink}
              loggedIn={loggedIn}
            />
          </div>
        </div>
      </nav>
    )
  }
}
