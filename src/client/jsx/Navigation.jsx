import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import NavLinks from './NavLinks'
import Alerts from './Alerts'

export default class Navigation extends React.Component {
  constructor() {
    super()

    this.state = ({
      navCollapsed: true
    })
  }

  componentWillReceiveProps(nextProps) {
    // Clear alerts if navigating to another page
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.alert()
    }
  }

  toggleNavCollapse = () => {
    this.setState({ navCollapsed: !this.state.navCollapsed })
  }

  render() {
    const { navCollapsed } = this.state
    const {
      alert, loggedIn, tagsToggle, searchToggle, disableSearchLink, disableTagsLink
    } = this.props

    return (
      <div id='nav-alerts-wrapper'>
        <nav className='navbar navbar-default'>
          <div className='container'>
            <div className='navbar-header'>
              <Link to='/'>
                <span id='logo'>My Bookmarks</span>
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
            <div className={`${navCollapsed ? 'collapse' : ''} navbar-collapse`} >
              <NavLinks
                tagsToggle={tagsToggle}
                disableTagsLink={disableTagsLink}
                searchToggle={searchToggle}
                disableSearchLink={disableSearchLink}
                loggedIn={loggedIn}
                alert={alert}
              />
            </div>
          </div>
        </nav>
        {this.props.alerts.messages.length > 0 &&
          <Alerts clearAlert={this.props.clearAlert} alerts={this.props.alerts} />
        }
      </div>
    )
  }
}

Navigation.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  alerts: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired,
  searchToggle: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  disableSearchLink: PropTypes.bool.isRequired,
  disableTagsLink: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired
}
