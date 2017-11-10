/* globals fetch, window */

import { Glyphicon } from 'react-bootstrap'
import PropTypes from 'prop-types'

import React from 'react'

const Logout = (props) => {
  const logout = async (event) => {
    event.preventDefault()
    window.location.replace('/login')
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    }
    try {
      const response = await fetch('/api/logout', fetchData)
      if (response.status === 401) {
        props.alert({ messages: 'You must be logged in to access this page', type: 'warning' })
      } else if (response.status !== 200) {
        props.alert({ messages: `Logout error: ${response.status}`, type: 'danger' })
      }
    } catch (error) {
      props.alert({ messages: `Logout failure: ${error}`, type: 'danger' })
    }
  }

  return (
    <div className='dropdown-item' onClick={logout}><Glyphicon glyph='log-out' /> Logout</div>
  )
}

Logout.propTypes = {
  alert: PropTypes.func.isRequired
}

export default Logout
