/* globals fetch */
import React from 'react'
import { Link } from 'react-router-dom'

export default class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      username: '',
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
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
    .then(data => {
      this.props.history.push('/')
      window.location.replace('/')
    })
    .catch(error => console.log('login failure: ' + error))
  }

  render () {
    return (
      <div>
        <div className='container well' id='login'>
          <form method='POST' action='/api/login' className='form-horizontal' name='Login' onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Login</legend>

              <div className='form-group container'>

                <label className='control-label'>Username</label>
                <input onChange={this.handleInputChange} onSubmit={this.handleSubmit}
                  type='text' className='form-control'
                  name='username' value={this.state.username}
                  placeholder='Username'
                />

                <label className='control-label'>Password</label>
                <input onChange={this.handleInputChange}
                  type='password' className='form-control'
                  name='password' placeholder='password'
                />

                  <div className='form-group'>
                    <div className='col-lg-10 col-lg-offset-2'>
                      <button type='submit' className='btn btn-primary'>Submit</button>
                    </div>
                  </div>
              </div>
            </fieldset>
          </form>
          <div className="center-text">Don't have an account? <Link to='/register'>Register</Link></div>
        </div>
      </div>
    )
  }
}
