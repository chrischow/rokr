import { useLayoutEffect, useState } from "react";
import $ from 'jquery';
import Form from "react-bootstrap/Form";
import { BsHeartFill, BsFillStarFill } from 'react-icons/bs';
import { FaAngry } from 'react-icons/fa';
import useToken from "../../shared/hooks/useToken";
import { createQuery } from "../../shared/utils/query";
import { validateFeedbackForm } from "../../shared/utils/validators";
import { Feedback } from "../../shared/types";
import { config } from "../../config";

import './styles.css';

interface IFeedbackFormProps {
  formCleanup: Function;
}

interface IFeedbackFormValues {
  Title: string;
  feedback: string;
  app: string;
}

export default function FeedbackForm(props: IFeedbackFormProps) {
  // Get token
  const token = useToken();
  
  // State
  const [formValues, setFormValues] = useState<IFeedbackFormValues>({
    Title: '', feedback: '', app: 'ROKR'
  });
  const [formErrors, setFormErrors] = useState([]);
  const [submitEnabled ,setSubmitEnabled] = useState(true);
  const formErrorsList = formErrors.map(item => <li key={item}>{item}</li>);
  
  // Text area
  useLayoutEffect(() => {
    $(function () {
      const textArea = document.getElementById('feedback');
      if (textArea) {
        textArea.style.height = "auto";
        textArea.style.height = textArea.scrollHeight + "px";
      }
      const feedbackTextArea = $("#feedback");
      feedbackTextArea.on("change input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
    });
  });

  // Handle change
  const handleChange = (event: any) => {
    setFormValues((prevData: Feedback) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value
      };
    })
  };

  // Submit form
  const submitForm = () => {
    // Clear previous errors
    setFormErrors([]);

    // Disable submit button while checking
    setSubmitEnabled(false);

    // Form validation
    const formOkay = validateFeedbackForm(
      formValues.feedback,
      token.isSuccess,
      setFormErrors
    );

    if (formOkay) {
      const reqDigest = token.isSuccess && token.data.FormDigestValue;
      const data = {
        __metadata: {
          type: config.feedbackListItemEntityTypeFullName
        },
        ...formValues
      }
      createQuery(config.feedbackListId, data, reqDigest, props.formCleanup, config.feedbackUrl);
    }
    
    // Re-enable submit button
    setSubmitEnabled(true);
  };

  return (
    <>
      <div className="mt-3 align-items-center feedback-text text-center">
        Whether it's things you loved <BsHeartFill className="text-green" />,
        things you hated <FaAngry className="text-red" />,
        or things you want <BsFillStarFill className="text-yellow" /> 
        ...we wanna hear it!
      </div>
      <Form className="mt-4" onSubmit={(event) => event.preventDefault()}>
        <Form.Group id="feedbackForm">
          <Form.Label className="form--label">Subject (Optional)</Form.Label>
          <Form.Control
            type="input"
            id="Title"
            name="Title"
            className="form-dark form--edit"
            value={formValues.Title}
            onChange={handleChange}
          />

          <Form.Label className="form--label">
            Feedback
          </Form.Label>
          <Form.Control
            as="textarea"
            id="feedback"
            name="feedback"
            className="form-dark form--edit"
            value={formValues.feedback}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
      <div className="mt-2 d-flex justify-content-end">
        <button
          className="btn btn-green"
          onClick={submitForm}
          disabled={!submitEnabled}
        >
          Submit Feedback
        </button>
      </div>
      {formErrorsList.length > 0 &&
        <div className="form-errors">
          <p>Please resolve the following errors:</p>
          <ul>{formErrorsList}</ul>
        </div>
      }
    </>
  );
}