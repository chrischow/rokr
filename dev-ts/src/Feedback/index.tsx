import { useState } from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { BiConversation } from 'react-icons/bi';
import FeedbackForm from './FeedbackForm';
import SharedModal from '../shared/SharedModal';

import './styles.css';

export default function Feedback() {
  // State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);

  // Feedback
  const addFeedback = () => {
    return <FeedbackForm 
      formCleanup={() => {
        setShowFeedbackModal(false);
        setShowFeedbackToast(true);
      }}
    />;
  }

  return (
    <>
      <div className="feedback-box" onClick={() => setShowFeedbackModal(true)}>
        <BiConversation /> Feedback
      </div>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowFeedbackToast(false)}
          show={showFeedbackToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <div className="me-auto">
              <span className='brand--normal'>
                <span className="accent-blue">R</span>
                <span className="accent-green">OKR</span>
              </span>
            </div>
          </Toast.Header>
          <Toast.Body>Thank you for your feedback!</Toast.Body>
        </Toast>
      </ToastContainer>
      <SharedModal
        modalTitle="Feedback"
        show={showFeedbackModal}
        onHide={() => setShowFeedbackModal(false)}
        renderModalContent={() => addFeedback()}
        handleCloseModal={() => setShowFeedbackModal(false)}
      />
    </>
  );
}