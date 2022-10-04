import { useLayoutEffect, useState } from 'react';
import $ from 'jquery';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import useToken from '../hooks/useToken';
import { getDate } from '../../shared/utils/dates';
import { createQuery, updateQuery } from '../../shared/utils/query';
import { validateKrForm } from '../../shared/utils/validators';
import { KeyResultFormValues, ObjectiveOptions } from '../../shared/types';
import { config } from '../../config';

import './styles.css';

interface KeyResultFormProps {
  formValues: KeyResultFormValues;
  mode: string;
  setFormValues: Function;
  formCleanup: Function;
  selectDisabled: boolean;
  objectiveOptions: ObjectiveOptions[];
  closeModal?: Function;
  openDeleteModal?: Function;
}

export default function KeyResultForm(props: KeyResultFormProps) {
  // Get token
  const token = useToken();

  // Enable datepicker
  useLayoutEffect(() => {
    $(function () {
      const textArea = document.getElementById('krDescription');
      if (textArea) {
        textArea.style.height = "auto";
        textArea.style.height = textArea.scrollHeight + "px";
      }
      const krDescTextArea = $("#krDescription");
      krDescTextArea.on("change input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });

      const krStartDatePicker = $("#krStartDate");
      krStartDatePicker.datepicker({
        format: "yyyy-mm-dd"
      });

      krStartDatePicker.on("changeDate", function () {
        props.setFormValues((prevData: KeyResultFormValues) => {
          return {
            ...prevData,
            krStartDate: getDate(krStartDatePicker.datepicker("getDate")),
          };
        });
      });

      const krEndDatePicker = $("#krEndDate");
      krEndDatePicker.datepicker({
        format: "yyyy-mm-dd"
      });

      krEndDatePicker.on("changeDate", function () {
        props.setFormValues((prevData: KeyResultFormValues) => {
          return {
            ...prevData,
            krEndDate: getDate(krEndDatePicker.datepicker("getDate")),
          };
        });
      });
    });
  }, [props]);

  // Validate form
  const [formErrors, setFormErrors] = useState([]);
  const formErrorsList = formErrors.map(item => <li key={item}>{item}</li>);

  // Submit button state
  const [submitEnabled, setSubmitEnabled] = useState(true);
  
  // Submit form
  const submitForm = () => {
    // Clear previous errors
    setFormErrors([]);

    // Disable submit button while checking
    setSubmitEnabled(false);

    // Extract mandatory form inputs
    const inputTitle = props.formValues.Title;
    const inputStartDate = props.formValues.krStartDate;
    const inputEndDate = props.formValues.krEndDate;
    const inputMinValue = props.formValues.minValue
    const inputCurrentValue = props.formValues.currentValue
    const inputMaxValue = props.formValues.maxValue

    // Form validation
    const formOkay = validateKrForm(
      inputTitle, inputStartDate, inputEndDate, inputMinValue, inputCurrentValue,
      inputMaxValue, token.isSuccess, setFormErrors
    );

    // Form ok
    if (formOkay) {
      const { Id, parentObjective, ...newData } = props.formValues;
      const reqDigest = token.isSuccess && token.data.FormDigestValue;

      if (props.mode === 'edit') {
        console.log('Edit form');
        const data = {
          __metadata: {
            type: config.krListItemEntityTypeFullName
          },
          ...newData,
          parentObjectiveId: parentObjective
        };
        
        updateQuery(config.krListId, Id, data, reqDigest, props.formCleanup);
      } else {
        console.log('New data');
        const data = {
          __metadata: {
            type: config.krListItemEntityTypeFullName
          },
          ...newData,
          parentObjectiveId: parentObjective
        };
        createQuery(config.krListId, data, reqDigest, props.formCleanup);
      }
    }

    // Re-enable submit button
    setSubmitEnabled(true);
  }
  
  // Handle change
  const handleChange = (event: any) => {
    props.setFormValues((prevData: KeyResultFormValues) => {    
      return {
        ...prevData,
        [event.target.name]: event.target.value
      };
    })
  }

  // Handle change for select box
  const handleSelectChange = (event: any) => {
    if (event) {
      props.setFormValues((prevData: KeyResultFormValues) => {
        return {
          ...prevData,
          'parentObjective': Number(event.value)
        }
      });
    }
  };

  return (
    <>
      <Form onSubmit={(event) => event.preventDefault()}>
        <Form.Group id="krForm">
          <Form.Label className="form--label">Title</Form.Label>
          <Form.Control
            type="input"
            id="Title"
            name="Title"
            className="form-dark form--edit"
            value={props.formValues.Title}
            onChange={handleChange}
          />

          <Form.Label className="form--label">Description</Form.Label>
          <Form.Control
            as="textarea"
            id="krDescription"
            name="krDescription"
            className="form-dark form--edit"
            value={props.formValues.krDescription}
            onChange={handleChange}
          />

          <Form.Label className="form--label">
            Objective - <span style={{color: "#4a5b74"}}>Type to Search</span>
          </Form.Label>
          <div className="mb-3">
            <Select
              id="objective-selector"
              defaultValue={props.objectiveOptions.find(obj => {
                return obj.value === props.formValues.parentObjective;
              })}
              options={props.objectiveOptions}
              isDisabled={props.selectDisabled}
              menuPosition="fixed"
              className="krform-select"
              classNamePrefix="krform-select"
              onChange={handleSelectChange}
            />
          </div>

          <Row className="align-items-center">
            <Col xs={6}>
              <Form.Label className="form--label">Start Date</Form.Label>
              <Form.Control
                type="text"
                id="krStartDate"
                name="krStartDate"
                className="form-dark form--edit datepicker"
                value={props.formValues.krStartDate}
                onChange={handleChange}
              />
            </Col>
            <Col xs={6}>
              <Form.Label className="form--label">End Date</Form.Label>
              <Form.Control
                type="text"
                id="krEndDate"
                name="krEndDate"
                className="form-dark form--edit datepicker"
                value={props.formValues.krEndDate}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col xs={4}>
              <Form.Label className="form--label">Min. Value</Form.Label>
              <Form.Control
                type="number"
                id="minValue"
                name="minValue"
                min="0"
                className="form-dark form--edit"
                value={props.formValues.minValue}
                onChange={handleChange}
              />
            </Col>
            <Col xs={4}>
              <Form.Label className="form--label">
                Current Value:
                <span className="form--slider-value text-center">
                  {props.formValues.currentValue}
                </span>
              </Form.Label>
              <Form.Control
                type="range"
                step="1"
                id="currentValue"
                name="currentValue"
                min={props.formValues.minValue}
                max={props.formValues.maxValue}
                className="form-range custom-range form-dark form--edit"
                value={props.formValues.currentValue}
                onChange={handleChange}
              />
            </Col>
            <Col xs={4}>
              <Form.Label className="form--label">Max. Value</Form.Label>
              <Form.Control
                type="number"
                id="maxValue"
                name="maxValue"
                className="form-dark form--edit"
                value={props.formValues.maxValue}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Form.Group>
      </Form>
      <div className={`mt-2 d-flex ${props.mode === 'edit' ? "justify-content-between" : "justify-content-end"}`}>
        {props.mode === 'edit' &&
          <button
            className="btn btn-red"
            onClick={() => {
              typeof props.closeModal !== 'undefined' && props.closeModal();
              typeof props.openDeleteModal !== 'undefined' && props.openDeleteModal();
            }}
          >
            Delete Key Result
          </button>
        }
        <button
          className="btn btn-green"
          onClick={submitForm}
          disabled={!submitEnabled}
        >
          {props.mode === 'edit' ? 'Save' : 'Add'} Key Result
        </button>
      </div>
      {formErrorsList.length > 0 &&
        <div className="form-errors">
          <p>Please resolve the following errors:</p>
          <ul>{formErrorsList}</ul>
        </div>
      }
    </>
  )
}