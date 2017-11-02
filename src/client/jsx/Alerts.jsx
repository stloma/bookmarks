import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

const Alerts = (props) => {
  // Avoids eslint no-unused-prop-types false positives on stateless functional components
  const { clearAlert } = props;
  return (
    <div className='error'>
      {props.alerts.messages.map(alert =>
        (<Alert key={alert} bsStyle={props.alerts.type} onDismiss={() => clearAlert(alert)}>
          <h4>{alert}</h4>
        </Alert>)
      )}
    </div>
  );
};

Alerts.propTypes = {
  alerts: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired
};

export default Alerts;
