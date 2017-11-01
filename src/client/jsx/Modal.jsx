import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

const ModalContainer = props => (
  <div>
    <Modal
      bsSize='small'
      animation={false}
      aria-labelledby='contained-modal-title-sm'
      show={props.showModal}
      onHide={props.closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-sm'>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='modal-text'>
          <h4>Are you sure you want to delete</h4><h3>{props.modalTitle.name}?</h3>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          className='btn btn-danger modal-delete'
          onClick={() => props.confirmDelete(props.showModal.id)}
        >
        Delete
        </button>
        <button
          className='btn btn-default modal-close'
          onClick={props.closeModal}
        >
        Cancel
        </button>
      </Modal.Footer>
    </Modal>
  </div>
);

ModalContainer.propTypes = {
  closeModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  modalTitle: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired
};

export default ModalContainer;
