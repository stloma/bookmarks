/* globals fetch */

import React from 'react'
import { Errors } from './Errors.jsx'
import { Link } from 'react-router-dom'

export default class Register extends React.Component {
  constructor () {
    super()

    this.state = ({
      user: [],
      errors: false
    })
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.closeError = this.closeError.bind(this)
  }

  createUser (newUser) {
    fetch('/api/registeruser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(response => {
      if (response.ok) {
        this.props.history.push('/')
      } else {
        response.json().then(errors => {
          this.setState({ errors: errors })
        })
      }
    }).catch(err => {
      console.log(`Error in sending data to server: ${err.message}`)
    })
  }

  closeError (removeError) {
    let errors = this.state.errors.filter(error => error !== removeError)
    this.setState({ errors: errors })
  }

  handleSubmit (event) {
    event.preventDefault()
    var form = document.forms.UserAdd
    if (form.password.value !== form.password2.value) {
      this.setState({ errors: [ 'Passwords do not match. Please try again' ] })
    } else {
      this.createUser({
        username: form.username.value,
        password: form.password.value
      })
    }
  }

  cancel () {
    this.props.history.goBack()
  }

  render () {
    return (
      <div id='pattern'>
        {this.state.errors &&
        <Errors closeError={this.closeError} errors={this.state.errors} />
      }
        <div className='container well' id='register'>
          <form method='post' name='UserAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Register</legend>

              <div className='form-group'>

                <label className='control-label'>Username</label>
                <input
                  type='text'
                  className='form-control'
                  name='username'
                  placeholder='Username/Email'
                />
                <label className='control-label'>Password</label>
                <input
                  type='password'
                  className='form-control'
                  name='password'
                  placeholder='Password'
                />
                <label className='control-label'>Re-enter password</label>
                <input
                  type='password'
                  className='form-control'
                  name='password2'
                  placeholder='Password'
                />
                <br />
                <div className='form-group'>
                  <div className='form-button'>
                    <button onClick={this.cancel} type='reset' className='btn btn-default'>Cancel</button>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                  </div>
                </div>
                <div className='center-text'>
                  Already have an account? <Link to='/login'>Login</Link>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
}
