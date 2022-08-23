import { useEffect, useState } from 'react';
import $ from 'jquery';
import { getDate } from '../../utils/dates';
import { createQuery } from '../../utils/query';
import useToken from '../../hooks/useToken';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { config } from '../../config';
import { validateObjectiveForm } from '../../utils/validators';

export default function ObjectiveForm(props) {

  // Get token
  const token = useToken();

  // Datepicker
  useEffect(() => {
    $(function () {
      const objDescTextArea = $("#objectiveDescription");
      objDescTextArea.on("change input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });

      var startDatePicker = $("#objectiveStartDate");
      startDatePicker.datepicker({
        format: "yyyy-mm-dd",
      });

      startDatePicker.on("changeDate", function () {
        props.setFormValues((prevData) => {
          return {
            ...prevData,
            objectiveStartDate: getDate(startDatePicker.datepicker("getDate")),
          };
        });
      });

      var endDatePicker = $("#objectiveEndDate");
      endDatePicker.datepicker({
        format: "yyyy-mm-dd",
      });

      endDatePicker.on("changeDate", function () {
        props.setFormValues((prevData) => {
          return {
            ...prevData,
            objectiveEndDate: getDate(endDatePicker.datepicker("getDate")),
          };
        });
      });
    });
  }, [props]);

  // Validate form
  const [formErrors, setFormErrors] = useState([]);
  const formErrorsList = formErrors.map(function (item) {
    return <li key={item}>{item}</li>;
  });

  // Form cleanup
  const formCleanup =  () => {
    // Reset form
    props.setFormValues({
      Title: '',
      objectiveDescription: '',
      objectiveStartDate: props.startDate,
      objectiveEndDate: props.endDate,
      frequency: props.freq,
      team: props.teamName,
      owner: props.staffOption ? props.staffOption : ''
    })

    // Close modal
    props.setShowObjectiveModal(false)
  }

  // Submit form
  function submitForm() {
    // Clear previous errors
    setFormErrors([]);

    // Extract mandatory form inputs
    const inputTitle = props.formValues.Title;
    const inputStartDate = props.formValues.objectiveStartDate;
    const inputEndDate = props.formValues.objectiveEndDate;

    const formOkay = validateObjectiveForm(inputTitle, inputStartDate, inputEndDate, token.isSuccess, setFormErrors);
    
    // Form ok
    if (formOkay) {
      const { objectiveId, ...newData } = props.formValues;
      const reqDigest = token.isSuccess && token.data.d.GetContextWebInformation.FormDigestValue;

      if (props.mode === "edit") {
        console.log('Edit form')
        console.log(newData);
        formCleanup();
      } else {
        console.log('New data:')
        const data = {
          __metadata: {
            type: config.objListItemEntityTypeFullName
          },
          ...props.formValues
        };
        createQuery(config.objListId, data, reqDigest, formCleanup);
      }
    }
  }

  // Handle change
  const handleChange = (event) => {
    props.setFormValues(prevData => {
      return {
        ...prevData,
        [event.target.name]: event.target.value
      }
    });
  };

  return (
    <>
      <Form onSubmit={(event) => event.preventDefault()}>
        <Form.Group id="objectiveForm">
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
            id="objectiveDescription"
            name="objectiveDescription"
            className="form-dark form--edit"
            value={props.formValues.objectiveDescription}
            onChange={handleChange}
          />

          <Row className="align-items-center">
            <Col xs={4}>
              <Form.Label className="form--label">Start Date</Form.Label>
              <Form.Control
                type="text"
                id="objectiveStartDate"
                name="objectiveStartDate"
                className="form-dark form--edit datepicker"
                value={props.formValues.objectiveStartDate}
                onChange={handleChange}
              />
            </Col>
            <Col xs={4}>
              <Form.Label className="form--label">End Date</Form.Label>
              <Form.Control
                type="text"
                id="objectiveEndDate"
                name="objectiveEndDate"
                className="form-dark form--edit datepicker"
                value={props.formValues.objectiveEndDate}
                onChange={handleChange}
              />
            </Col>
            <Col xs={4}>
              <Form.Label className="form--label">Frequency</Form.Label>
              <Form.Select
                id="frequency"
                name="frequency"
                className="form-dark form--edit"
                value={props.formValues.frequency}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col xs={6}>
              <Form.Label className="form--label">Team</Form.Label>
              <Form.Select
                id="team"
                name="team"
                className="form-dark form--edit"
                value={props.formValues.team}
                onChange={handleChange}
              >
                {config.teams.map(team => {
                  return <option key={`option-${team.slug}`} value={team.teamName}>{team.teamName}</option>
                })}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label className="form--label">Owner</Form.Label>
              <Form.Control
                type="text"
                id="owner"
                name="owner"
                className="form-dark form--edit"
                value={props.formValues.owner}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Form.Group>
      </Form>
      <div className="text-end mt-2">
        <button className="btn btn-green" onClick={submitForm}>
          Submit
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