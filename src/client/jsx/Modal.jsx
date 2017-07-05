import React from 'react'
import { Modal } from 'react-bootstrap'

export const ModalContainer = (props) => (

  <div>
    <Modal bsSize='small' aria-labelledby='contained-modal-title-sm' show={props.showModal} onHide={props.closeModal}>
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
          onClick={() => props.confirmDelete(props.showModal.id)} >
        Delete
        </button>
        <button
          className='btn btn-default modal-close'
          onClick={props.closeModal} >
        Close
        </button>
      </Modal.Footer>
    </Modal>
  </div>
)
