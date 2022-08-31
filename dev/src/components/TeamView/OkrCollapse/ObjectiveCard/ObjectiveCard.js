import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import slugify from 'slugify';
import { getData } from '../../../../utils/query';
import { useTeamObjectivesCache, useTeamObjectives } from "../../../../hooks/useObjectives";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CaretIcon, EditIconText, AddIconText } from '../../../Icons/Icons';
import SharedModal from '../../../SharedModal/SharedModal';
import ProgressBar from '../../ProgressBar/ProgressBar';
import ObjectiveEdit from './ObjectiveEdit/ObjectiveEdit';

import './ObjectiveCard.css';
import KeyResultAdd from './KeyResultAdd/KeyResultAdd';

export default function ObjectiveCard(props) {
  // State
  const [showObjectiveEditModal, setShowObjectiveEditModal] = useState(false);
  const [objectiveFormValues, setObjectiveFormValues] = useState({});
  const [showKrAddModal, setShowKrAddModal] = useState(false);

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

  // OBJECTIVE FORM
  // Re-populate form
  const currentObjective = {
    Id: props.Id,
    Title: props.Title,
    objectiveDescription: props.objectiveDescription ? props.objectiveDescription : '',
    objectiveStartDate: props.objectiveStartDate,
    objectiveEndDate: props.objectiveEndDate,
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
      invalidateAndRefetch={invalidateAndRefetch}
      setShowObjectiveEditModal={setShowObjectiveEditModal}
      team={props.team}
      freq={props.frequency}
      {...props}
    />;
  }

  // KEY RESULT FORM
  // Get objectives
  const objectives = getData(
    queryClient.getQueryState('objectives'),
    useTeamObjectives,
    useTeamObjectivesCache
  )(props.team);
  
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
    krStartDate: props.objectiveStartDate,
    krEndDate: props.objectiveEndDate,
    minValue: 0,
    maxValue: 1,
    currentValue: 0,
    parentObjective: props.Id
  };

  const [krFormValues, setKrFormValues] = useState({...defaultKrValues});

  // Update form values based on the things that can change
  useEffect(() => {
    setKrFormValues(prevData => {
      return {
        ...prevData,
        krStartDate: props.objectiveStartDate,
        krEndDate: props.objectiveEndDate,
      };
    });
  }, [props.objectiveStartDate, props.objectiveEndDate])

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
      invalidateAndRefetch={invalidateAndRefetch}
      setShowKrAddModal={setShowKrAddModal}
      defaultKrValues={defaultKrValues}
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
        handleCloseModal={handleCloseObjectiveModal}
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