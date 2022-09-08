import { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function DeleteForm(props) {
  // Form state
  const [confirmText, setConfirmText] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Handle change
  const handleChange = (event) => {
    setConfirmText(event.target.value);
  }
  return (
    <div className="text-center mt-5 mb-5">
      <h5>You are about to delete the following objective:</h5>
      <div className="mt-4 mb-4">
        <h4 className="text-red">{props.Title}</h4>
      </div>
      <div className="mb-4">
        To confirm, type <Badge bg="danger" style={{fontSize: "1.0rem"}}>Yes, delete this objective.</Badge> in the box below.
      </div>
      <Row className="justify-content-center">
        <Col xs={6} xl={4}>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Group>
              <Form.Control
                type="input"
                name="confirmText"
                className="form-dark form--edit text-center text-red mb-3"
                value={confirmText}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
          {showErrorMessage && <div className="mb-4">
            <h6 className="text-red">
              Oops...there was a typo somewhere.<br />
              Please check and try again.
            </h6>
          </div>}
          <button
            className="btn btn-red"
            onClick={() => {
              if (confirmText === 'Yes, delete this objective.') {
                props.closeModal();
                console.log(`Delete Id=${props.Id}, ${props.Title}`);
              } else {
                setShowErrorMessage(true);
              }
            }}
          >
            Submit
          </button>
        </Col>
      </Row>
    </div>
  );
}