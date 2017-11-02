/* globals fetch, window */

import { Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';

import React from 'react';

const Logout = (props) => {
  const logout = async (event) => {
    event.preventDefault();
    window.location.replace('/login');
    const fetchData = {
      method: 'GET',
      credentials: 'include'
    };
    try {
      const response = await fetch('/api/logout', fetchData);
      if (response.status === 401) {
        props.alert({ messages: 'You must be logged in to access this page', type: 'warning' });
      } else if (response.status !== 200) {
        props.alert({ messages: `Logout error: ${response.status}`, type: 'danger' });
      } else {
        props.alert({ messages: 'logged out', type: 'success' });
      }
    } catch (error) {
      props.alert({ messages: `Logout failure: ${error}`, type: 'danger' });
    }
  };

  return (
    <a onClick={logout}><Glyphicon glyph='log-out' /> Logout</a>
  );
};

Logout.propTypes = {
  alert: PropTypes.func.isRequired
};

export default Logout;
