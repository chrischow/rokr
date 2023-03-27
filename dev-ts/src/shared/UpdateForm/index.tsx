import { useLayoutEffect, useState } from 'react';
import useToken from '../../shared/hooks/useToken';
import $ from 'jquery';
import { getDate } from '../../shared/utils/dates';
import { createQuery, updateQuery } from '../../shared/utils/query';
import { validateUpdateForm } from '../../shared/utils/validators';
import { Update, UpdateFormValues } from '../../shared/types';
import Form from 'react-bootstrap/Form';
import { config } from '../../config';

interface UpdateFormProps {
  formValues: UpdateFormValues;
  mode: string;
  setFormValues: Function;
  formCleanup: Function;
  size?: string;
  closeModal?: Function;
  openDeleteModal?: Function;
}

export default function UpdateForm(props: UpdateFormProps) {

  // Get token
  const token = useToken();

  // State for form validation
  const [formErrors, setFormErrors] = useState<number[]>([]);
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(true);
  const formErrorsList = formErrors.map(item => <li key={item}>{item}</li>);

  // Enable datepicker
  useLayoutEffect(() => {
    $(function () {
      const textArea = document.getElementById('updateText');
      if (textArea) {
        textArea.style.height = "auto";
        textArea.style.height = textArea.scrollHeight + "px";
      }
      const updateTextArea = $("#updateText");
      updateTextArea.on("change input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });

      const updateDatePicker = $("#updateDate");
      updateDatePicker.datepicker({
        format: "yyyy-mm-dd",
      });

      updateDatePicker.on("changeDate", function () {
        props.setFormValues((prevData: Omit<Update, "Id" | "Editor">) => {
          return {
            ...prevData,
            updateDate: getDate(updateDatePicker.datepicker("getDate")),
          };
        });
      });

    });
  }, [props]);

  // Handle change
  const handleChange = (event: any) => {
    props.setFormValues((prevData: Omit<Update, "Id" | "Editor">) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value
      };
    })
  }

  // Submit form
  const submitForm = () => {
    // Clear previous errors
    setFormErrors([]);

    // Disable submit button while checking
    setSubmitEnabled(false);

    // Extract mandatory form inputs
    const inputDate = props.formValues.updateDate;
    const inputUpdateText = props.formValues.updateText;

    // Form validation
    const formOkay = validateUpdateForm(
      inputDate, inputUpdateText, token.isSuccess, setFormErrors
    );

    // Form ok
    if (formOkay) {
      const { Id, ...newData } = props.formValues;
      const reqDigest = token.isSuccess && token.data.FormDigestValue;

      if (props.mode === 'edit') {
        console.log('Edit form');
        const data = {
          __metadata: {
            type: config.updateListItemEntityTypeFullName
          },
          ...newData
        }
        updateQuery(config.updateListTitle, Id, data, reqDigest, props.formCleanup);
      } else {
        console.log('New data');
        const data = {
          __metadata: {
            type: config.updateListItemEntityTypeFullName
          },
          ...props.formValues
        };
        createQuery(config.updateListTitle, data, reqDigest, props.formCleanup);
      }
    }

    // Re-enable submit button
    setSubmitEnabled(true);
  }

  return (
    <>
      {props.formValues && 
        <Form onSubmit={(event) => event.preventDefault()}>
          <Form.Group id="updateForm">
            <Form.Label className="form--label">Date</Form.Label>
            <Form.Control
              type="text"
              id="updateDate"
              name="updateDate"
              className="form-dark form--edit datepicker"
              value={props.formValues.updateDate}
              style={props.size === "sm" ? { fontSize: "1.0rem" } : {}}
              onChange={handleChange}
            />
            <Form.Label className="form--label">Update</Form.Label>
            <Form.Control
              as="textarea"
              type="input"
              id="updateText"
              name="updateText"
              className="form-dark form--edit"
              value={props.formValues.updateText}
              style={props.size === "sm" ? { fontSize: "1.0rem" } : {}}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      }
      <div className={`mt-2 d-flex ${props.mode === 'edit' ? "justify-content-between" : "justify-content-end"}`}>
        {props.mode === 'edit' &&
          <button
            className="btn btn-red"
            onClick={() => {
              typeof props.closeModal !== 'undefined' && props.closeModal();
              typeof props.openDeleteModal !== 'undefined' && props.openDeleteModal();
            }}
          >
            Delete Update
          </button>
        }
        <button
          className="btn btn-green"
          onClick={submitForm}
          disabled={!submitEnabled}
        >
          {props.mode === 'edit' ? 'Save' : 'Add'} Update
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