/* globals fetch */
import React from 'react'
import { Link } from 'react-router-dom'
import { Errors } from './Errors.jsx'

export default class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      username: '',
      password: '',
      errors: false
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.closeError = this.closeError.bind(this)
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  closeError (removeError) {
    let errors = this.state.errors.filter(error => error !== removeError)
    this.setState({ errors: errors })
  }

  handleSubmit (event) {
    event.preventDefault()
    let data = 'username=' + this.state.username + '&password=' + this.state.password
    let fetchData = {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: data
    }
    fetch('/api/login', fetchData)
    .then(response => {
      if (response.ok) {
        window.location.replace('/')
      } else if (response.status === 401) {
        this.setState({ errors: ['Username or password incorrect'] })
      } else if (response.status === 400) {
        this.setState({ errors: ['Please enter a username and password'] })
      }
    }).catch(err => {
      console.log('Login failure: ' + err)
    })
  }

  render () {
    return (
      <div id='pattern'>
        {this.state.errors &&
        <Errors closeError={this.closeError} errors={this.state.errors} />
      }
        <div className='container well' id='login'>
          <form method='POST' action='/api/login' name='Login' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Login</legend>

              <div className='form-group'>

                <label>Username:</label>
                <input
                  autoFocus onChange={this.handleInputChange}
                  onSubmit={this.handleSubmit}
                  type='text'
                  className='form-control'
                  name='username'
                  value={this.state.username}
                  placeholder='username'
                  id='username'
                />

                <label>Password:</label>
                <input
                  onChange={this.handleInputChange}
                  type='password
                  ' className='form-control'
                  name='password'
                  placeholder='password'
                  id='password'
                />
                <div className='form-group'>
                  <div className='form-button'>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                  </div>
                </div>
              </div>
          <div className='center-text'>Don't have an account? <Link to='/register'>Register</Link></div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }
}
