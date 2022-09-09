import Modal from 'react-bootstrap/Modal';

import './styles.css';

export default function SharedModal(props) {
  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {props.renderModalContent()}
      </Modal.Body>

      <Modal.Footer>
        <div className="modal-footer-custom">
          <button type="button" className="btn btn-secondary" onClick={() => props.handleCloseModal()}>Close</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}