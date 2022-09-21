import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { IconContext } from 'react-icons';
import { RiAddFill } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTeamObjectives } from "../../../../shared/hooks/useObjectives";
import { getDate } from '../../../../shared/utils/dates';
import { Objective, ObjectiveFormValues } from '../../../../shared/types';
import { CaretIcon } from '../../../../shared/Icons';
import SharedModal from '../../../../shared/SharedModal';
import ProgressBar from '../../../../shared/ProgressBar';
import DeleteForm from '../../../../shared/DeleteForm';
import ObjectiveForm from '../../../../shared/ObjectiveForm';
import KeyResultForm from '../../../../shared/KeyResultForm';

import './styles.css';

interface ObjectiveCardProps extends Objective {
  keyResultIds: number[];
  updateIds: number[];
  objId: string;
  isClicked: boolean;
  progress: number;
  setIsClicked: Function;
}

export default function ObjectiveCard(props: ObjectiveCardProps) {
  // State
  const [showObjectiveEditModal, setShowObjectiveEditModal] = useState(false);
  const [showObjectiveDeleteModal, setShowObjectiveDeleteModal] = useState(false);
  const [showKrAddModal, setShowKrAddModal] = useState(false);
  
  // Invalidate data
  const queryClient = useQueryClient();
  const invalidateObjectives = () => {
    queryClient.invalidateQueries(['objectives', 'team', props.team], { refetchInactive: true });
  };
  
  const invalidateKeyResults = () => {
    queryClient.invalidateQueries(['keyResults', 'team', props.team], { refetchInactive: true });
  };
  
  const invalidateUpdates = () => {
    queryClient.invalidateQueries(['updates', 'team', props.team], { refetchInactive: true });
  };
  
  // EDIT OBJECTIVE FORM
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
  // Set state
  const [objectiveFormValues, setObjectiveFormValues] = useState<ObjectiveFormValues>(currentObjective);
  
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
    return <ObjectiveForm
      formValues={objectiveFormValues}
      setFormValues={setObjectiveFormValues}
      team={props.team}
      freq={props.frequency}
      formCleanup={() => {
        invalidateObjectives();
        setShowObjectiveEditModal(false);
      }}
      closeModal={handleCloseObjectiveModal}
      openDeleteModal={() => setShowObjectiveDeleteModal(true)}
      mode='edit'
    />
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

  // ADD KEY RESULT FORM
  // Get objectives
  const objectives = useTeamObjectives(props.team);
  const objectiveOptions = objectives.isSuccess && objectives.data.map((obj: Objective) => {
    return {
      value: obj.Id,
      label: `[${obj.team} ${obj.frequency} - ${getDate(obj.objectiveEndDate)}] ${obj.Title}`
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
        krStartDate: getDate(props.objectiveStartDate),
        krEndDate: getDate(props.objectiveEndDate),
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
    return <KeyResultForm
      formValues={krFormValues}
      setFormValues={setKrFormValues}
      objectiveOptions={objectiveOptions}
      selectDisabled={true}
      formCleanup={() => {
        // Invalidate and refetch data
        invalidateKeyResults();

        // Reset form
        setKrFormValues({...defaultKrValues});

        // Close modal
        setShowKrAddModal(false);
      }}
      mode="new"
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
            onClick={() => props.setIsClicked((prevState: boolean) => !prevState)}
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
                <IconContext.Provider value={{ className: "objective-card--edit-icon" }}>
                  <FaEdit />
                </IconContext.Provider>
              </button>
              <button
                className="btn objective-card--add-kr-button"
                onClick={() => setShowKrAddModal(true)}
              >
                <span className="objective-card--add-kr-text mr-1">Add KR</span>
                <IconContext.Provider value={{ className: "objective-card--edit-icon" }}>
                  <RiAddFill />
                </IconContext.Provider>
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