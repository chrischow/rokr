import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import slugify from 'slugify';
import { useTeamObjectives } from "../../../../../shared/hooks/useObjectives";
import { getDate } from '../../../../../utils/dates';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CaretIcon, EditIconText, AddIconText } from '../../../../../shared/Icons';
import SharedModal from '../../../../../shared/SharedModal';
import ProgressBar from '../ProgressBar';
import ObjectiveEdit from './ObjectiveEdit';
import KeyResultAdd from './KeyResultAdd';
import DeleteForm from '../../../../../shared/DeleteForm';

import './styles.css';

export default function ObjectiveCard(props) {
  // State
  const [showObjectiveEditModal, setShowObjectiveEditModal] = useState(false);
  const [showObjectiveDeleteModal, setShowObjectiveDeleteModal] = useState(false);
  const [objectiveFormValues, setObjectiveFormValues] = useState({});
  const [showKrAddModal, setShowKrAddModal] = useState(false);
  
  // Invalidate data
  const queryClient = useQueryClient();
  const invalidateObjectives = () => {
    queryClient.invalidateQueries([`objectives-${slugify(props.team)}`], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  const invalidateKeyResults = () => {
    queryClient.invalidateQueries([`keyResults-${slugify(props.team)}`], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  const invalidateUpdates = () => {
    queryClient.invalidateQueries(['updates', props.team], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  // OBJECTIVE FORM
  // Re-populate form
  const currentObjective = {
    Id: props.Id,
    Title: props.Title,
    objectiveDescription: props.objectiveDescription ? props.objectiveDescription : '',
    objectiveStartDate: getDate(props.objectiveStartDate),
    objectiveEndDate: getDate(props.objectiveEndDate),
    frequency: props.frequency,
    team: props.team,
    owner: props.owner ? props.owner : ''
  };

  useEffect(() => {
    setObjectiveFormValues({...currentObjective});
  }, [props]);

  // Close Objective modal
  const handleCloseObjectiveModal = () => {
    setObjectiveFormValues({...currentObjective});
    setShowObjectiveEditModal(false);
  };

  // Render modal content
  const editObjective = () => {
    return <ObjectiveEdit
      objectiveFormValues={objectiveFormValues}
      setObjectiveFormValues={setObjectiveFormValues}
      setShowObjectiveEditModal={setShowObjectiveEditModal}
      closeModal={handleCloseObjectiveModal}
      openDeleteModal={() => setShowObjectiveDeleteModal(true)}
      team={props.team}
      freq={props.frequency}
      {...props}
    />;
  }
  
  // DELETE OBJECTIVE FORM
  // Close delete modal
  const handleCloseObjectiveDeleteModal = () => {
    setShowObjectiveDeleteModal(false);
  }

  const deleteObjective = () => {
    return <DeleteForm
      Id={props.Id}
      Title={props.Title}
      itemType="Objective"
      keyResultIds={props.keyResultIds}
      updateIds={props.updateIds}
      invalidateObjectives={invalidateObjectives}
      invalidateKeyResults={invalidateKeyResults}
      invalidateUpdates={invalidateUpdates}
      closeModal={handleCloseObjectiveDeleteModal}
    />
  };

  // KEY RESULT FORM
  // Get objectives
  const objectives = useTeamObjectives(props.team);
  const objectiveOptions = objectives.isSuccess && objectives.data.map(obj => {
    return {
      value: obj.Id,
      label: `[${obj.team} ${obj.frequency}] ${obj.Title}`
    };
  })
  
  // Form values
  const defaultKrValues = {
    Title: '',
    krDescription: '',
    krStartDate: getDate(props.objectiveStartDate),
    krEndDate: getDate(props.objectiveEndDate),
    minValue: 0,
    maxValue: 1,
    currentValue: 0,
    parentObjective: props.Id
  };

  const [krFormValues, setKrFormValues] = useState({...defaultKrValues});

  // Update default KR values
  useEffect(() => {
    setKrFormValues(prevData => {
      return {
        ...prevData,
        parentObjective: props.Id
      }
    })
  }, [props.Id]);

  // Update form values based on the things that can change
  useEffect(() => {
    setKrFormValues(prevData => {
      return {
        ...prevData,
        parentObjective: props.Id,
        krStartDate: props.objectiveStartDate,
        krEndDate: props.objectiveEndDate,
      };
    });
  }, [props.objectiveStartDate, props.objectiveEndDate, props.Id])

  // Close modal
  const handleCloseKrAddModal = () => {
    // Reset form
    setKrFormValues({...defaultKrValues});
    setShowKrAddModal(false);
  };

  // KR Form
  const addKr = () => {
    return <KeyResultAdd
      krFormValues={krFormValues}
      setKrFormValues={setKrFormValues}
      objectiveOptions={objectiveOptions}
      setShowKrAddModal={setShowKrAddModal}
      defaultKrValues={defaultKrValues}
      team={props.team}
    />
  };

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
                onClick={() => setShowKrAddModal(true)}
              >
                <span className="objective-card--add-kr-text mr-1">Add KR</span>
                <AddIconText className="objective-card--edit-icon" />
              </button>
            </>
          )}
        </Col>
        <Col xs={2} className="text-center">
          <span className="objective-card--text">
            {getDate(props.objectiveEndDate)}
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
        handleCloseModal={handleCloseObjectiveModal}
      />
      <SharedModal
        modalTitle="Delete Objective"
        show={showObjectiveDeleteModal}
        onHide={() => setShowObjectiveDeleteModal(false)}
        renderModalContent={() => deleteObjective()}
        handleCloseModal={() => setShowObjectiveDeleteModal(false)}
      />
      <SharedModal
        modalTitle="New Key Result"
        show={showKrAddModal}
        onHide={() => setShowKrAddModal(false)}
        renderModalContent={() => addKr()}
        handleCloseModal={handleCloseKrAddModal}
      />
    </div>
  );
}