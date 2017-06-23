/* globals fetch */

import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

export default class Register extends React.Component {
  constructor () {
    super()

    this.state = ({ user: [] })
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  createUser (newUser) {
    fetch('/api/registeruser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(response => {
      if (response.ok) {
        response.json().then(updatedUser => {
          updatedUser.created = new Date().getTime()
          const newUser = this.state.user.concat(updatedUser)
          this.setState({ user: newUser })
        })
      } else {
        response.json().then(error => {
          console.log('Failed to add user: ' + error.message)
        })
      }
    }).catch(err => {
      console.log('Error in sending data to server: ' + err.message)
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    var form = document.forms.UserAdd
    this.createUser({
      name: form.name.value,
      username: form.username.value,
      email: form.email.value,
      password: form.password.value
    })
    form.name.value = ''
    form.username.value = ''
    form.email.value = ''
    form.password.value = ''
  }

  cancel () {
    this.props.history.goBack()
  }

  render () {
    console.log(this.props)
    return (
      <div>
        {/*
        Form is submitting to index, fix
      */}
        <div className='container well' id='register'>
          <form method='post' className='form-horizontal' name='UserAdd' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Register</legend>

              <div className='form-group container'>
                <label className='control-label'>Name</label>
                <input type='text' className='form-control ' name='name' placeholder='Name' />

                <label className='control-label'>Username</label>
                <input type='text' className='form-control' name='username' placeholder='Username' />
                <label className='control-label'>Email</label>
                <input type='text' className='form-control' name='email' placeholder='Email' />
                <label className='control-label'>Password</label>
                <input type='password' className='form-control' name='password' placeholder='Password' />
                <div className='float-right'>
                  <div className='form-group'>
                    <div className='col-lg-10 col-lg-offset-2'>
                      <button onClick={this.cancel} type='reset' className='btn btn-default'>Cancel</button>
                      <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
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
