import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import slugify from 'slugify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CaretIcon, EditIconText, AddIconText } from '../../Icons/Icons';
import SharedModal from '../../SharedModal/SharedModal';
import ObjectiveForm from '../../ObjectiveForm/ObjectiveForm';

import './ObjectiveCard.css';
import ProgressBar from '../ProgressBar/ProgressBar';

export default function ObjectiveCard(props) {
  // State
  const [showObjectiveEditModal, setShowObjectiveEditModal] = useState(false);
  const [objectiveFormValues, setObjectiveFormValues] = useState({});

  // Create query client
  const queryClient = useQueryClient()

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries('objectives', { refetchInactive: true });
    queryClient.invalidateQueries('keyResults', { refetchInactive: true });
    queryClient.invalidateQueries(`objectives-${slugify(props.team)}`, { refetchInactive: true });
    queryClient.invalidateQueries(`keyResults-${slugify(props.team)}`, { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  // Re-populate form
  useEffect(() => {
    setObjectiveFormValues({
      Id: props.Id,
      Title: props.Title,
      objectiveDescription: props.objectiveDescription,
      objectiveStartDate: props.objectiveStartDate,
      objectiveEndDate: props.objectiveEndDate,
      frequency: props.frequency,
      team: props.team,
      owner: props.owner ? props.owner : ''
    });
  }, [props]);

  // Close modal
  const handleCloseModal = () => {
    setShowObjectiveEditModal(false);
  };

  // Objective form cleanup
  const objectiveFormCleanup = (newData) => {
    // Invalidate and refetch data
    invalidateAndRefetch();

    // Close modal
    setShowObjectiveEditModal(false);
  };

  const addKR = () => {
    console.log('Add KR');
  }

  // Render modal content
  const editObjective = () => {
    return <ObjectiveForm
      formValues={objectiveFormValues}
      setFormValues={setObjectiveFormValues}
      setShowObjectiveModal={setShowObjectiveEditModal}
      startDate={props.objectiveStartDate}
      endDate={props.objectiveEndDate}
      staffOption={props.staffOption}
      team={props.team}
      freq={props.frequency}
      formCleanup={objectiveFormCleanup}
      mode='edit'
    />;
  }

  return (
    <div className="objective-card">
      <Row className="align-items-top mt-2">
        <div className="arrow-div">
          <Button
            className={
              "btn-collapse text-center" + 
              (props.isClicked ? " rotated" : "")}
            variant='collapse'
            aria-controls={props.objId}
            aria-expanded={props.isClicked}
            onClick={() => props.setIsClicked(prevState => !prevState)}
            id={`btn-${props.objId}`}
          >
            <CaretIcon />
          </Button>
        </div>
        <Col xs={7}>
          <h5 className="objective-card--title text-left">
            <span className="mr-2">{props.Title}</span>
          </h5>
          {props.isClicked && (
            <>
              <div className="objective-card--description mb-2">
                {props.objectiveDescription}
              </div>
              <button
                className="btn objective-card--edit-button mr-3"
                onClick={() => setShowObjectiveEditModal(true)}
              >
                <span className="objective-card--edit-text mr-1">
                  Edit
                </span>
                <EditIconText className="objective-card--edit-icon" />
              </button>
              <button
                className="btn objective-card--add-kr-button"
                onClick={addKR}
              >
                <span className="objective-card--add-kr-text mr-1">Add KR</span>
                <AddIconText className="objective-card--edit-icon" />
              </button>
            </>
          )}
        </Col>
        <Col xs={2} className="text-center">
          <span className="objective-card--text">
            {props.objectiveEndDate}
          </span>
        </Col>
        <Col xs={3} className="objective-card--progress-bar">
          <ProgressBar progress={props.progress} isKeyResult={false} />
        </Col>
      </Row>
      <SharedModal
        modalTitle="Edit Objective"
        show={showObjectiveEditModal}
        onHide={() => setShowObjectiveEditModal(false)}
        renderModalContent={() => editObjective()}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}