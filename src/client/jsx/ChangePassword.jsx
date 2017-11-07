/* globals fetch, document */

import React from 'react'
import PropTypes from 'prop-types'

export default class ChangePassword extends React.Component {
  constructor() {
    super()
    this.state = {
      password: ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const form = document.forms.changePassword
    if (form.password.value !== form.password2.value) {
      this.props.alert({ messages: 'Passwords do not match. Please try again', type: 'danger' })
    } else {
      this.changePassword({
        password: form.password.value
      })
    }
  }

  changePassword = async (newPassword) => {
    try {
      const response = await fetch('/api/changepassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPassword),
        credentials: 'include'
      })
      if (response.ok) {
        this.props.history.goBack()
      } else {
        const alerts = await response.json()
        this.props.alert({ messages: alerts, type: 'danger' })
      }
    } catch (error) {
      this.props.alert({ messages: `Error in changing password: ${error}`, type: 'danger' })
    }
  }

  cancel = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <div id='pattern'>
        <div className='container well' id='change-password'>
          <form method='POST' action='/api/login' name='changePassword' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Change Password</legend>
              <div className='form-group'>
                <label htmlFor='username'>Password:</label>
                <input
                  autoFocus
                  type='text'
                  className='form-control'
                  name='username'
                  placeholder='password'
                  id='password'
                />
                <label htmlFor='password'>Re-enter password:</label>
                <input
                  type='password'
                  className='form-control'
                  name='password2'
                  placeholder='same password'
                  id='password2'
                />
                <div className='form-group'>
                  <div className='form-button'>
                    <button
                      onClick={this.cancel}
                      type='reset'
                      className='btn btn-default'
                    >
                      Cancel
                    </button>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
}

ChangePassword.propTypes = {
  alert: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}
