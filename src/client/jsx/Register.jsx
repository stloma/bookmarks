/* globals fetch, document */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Errors from './Errors';

export default class Register extends React.Component {
  constructor() {
    super();

    this.state = ({
      user: [],
      errors: false
    });
  }

  async createUser(newUser) {
    try {
      const response = await fetch('/api/registeruser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        this.props.history.push('/');
      } else {
        response.json().then((errors) => {
          this.setState({ errors });
        });
      }
    } catch (error) {
      console.log(`Error in sending data to server: ${error.message}`);
    }
  }

  closeError = (removeError) => {
    const errors = this.state.errors.filter(error => error !== removeError);
    this.setState({ errors });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const form = document.forms.UserAdd;
    if (form.password.value !== form.password2.value) {
      this.setState({ errors: ['Passwords do not match. Please try again'] });
    } else {
      this.createUser({
        username: form.username.value,
        password: form.password.value
      });
    }
  }

  cancel = () => {
    this.props.history.goBack();
  }

  render() {
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
                <label htmlFor='username' className='control-label'>Username</label>
                <input
                  type='text'
                  className='form-control'
                  name='username'
                  id='username'
                  placeholder='Username/Email'
                />
                <label htmlFor='password' className='control-label'>Password</label>
                <input
                  type='password'
                  className='form-control'
                  name='password'
                  id='password'
                  placeholder='Password'
                />
                <label htmlFor='password2' className='control-label'>Re-enter password</label>
                <input
                  type='password'
                  className='form-control'
                  name='password2'
                  id='password2'
                  placeholder='Password'
                />
                <br />
                <div className='form-group'>
                  <div className='form-button'>
                    <button onClick={this.cancel} type='reset' className='btn btn-default'>
                      Cancel
                    </button>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                  </div>
                </div>
                <div className='center-text'>
                  Already have an account?  <Link to='/login'>Login</Link>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired
};
