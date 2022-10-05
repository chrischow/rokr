import { useState } from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { AiFillStar } from 'react-icons/ai';
import { BiConversation } from 'react-icons/bi';
import FeedbackForm from './FeedbackForm';
import SurveyForm from './SurveyForm';
import SharedModal from '../shared/SharedModal';

import './styles.css';

export default function Feedback() {
  // State
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState<boolean>(false);
  const [showFeedbackWord, setShowFeedbackWord] = useState<boolean>(true);
  const [showSurveyModal, setShowSurveyModal] = useState<boolean>(false);
  const [showSurveyToast, setShowSurveyToast] = useState<boolean>(false);
  const [showSurveyWord, setShowSurveyWord] = useState<boolean>(false);

  // Feedback
  const addFeedback = () => {
    return <FeedbackForm 
      formCleanup={() => {
        setShowFeedbackModal(false);
        setShowFeedbackToast(true);
      }}
      />;
    }
    
    // Survey
    const addSurvey = () => {
      return <SurveyForm 
      formCleanup={() => {
        setShowSurveyModal(false);
        setShowSurveyToast(true);
      }}
    />;
  }

  return (
    <>
      <div className="feedback-area">
        <div
          className="feedback-box"
          onClick={() => setShowFeedbackModal(true)}
          >
          <BiConversation style={{marginBottom: "3px"}} />
          <span className={showFeedbackWord ? 'feedback-word-show' : 'feedback-word-hide'}>
            &nbsp;Feedback
          </span>
        </div>
        <div
          className="survey-box"
          onClick={() => setShowSurveyModal(true)}
          onMouseOver={() => {
            setShowFeedbackWord(false);
            setShowSurveyWord(true);
          }}
          onMouseOut={() => {
            setShowFeedbackWord(true);
            setShowSurveyWord(false);
          }}
        >
          <AiFillStar style={{marginBottom: "3px"}} />
          <span className={showSurveyWord ? 'feedback-word-show' : 'feedback-word-hide'}>
            &nbsp;Survey
          </span>
        </div>
      </div>
      <ToastContainer position="top-end" className="p-3">
        {/* Toast for feedback */}
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
        {/* Toast for survey */}
        <Toast
          onClose={() => setShowSurveyToast(false)}
          show={showSurveyToast}
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
      <SharedModal
        modalTitle="User Satisfaction Survey"
        show={showSurveyModal}
        onHide={() => setShowSurveyModal(false)}
        renderModalContent={() => addSurvey()}
        handleCloseModal={() => setShowSurveyModal(false)}
      />
    </>
  );
}