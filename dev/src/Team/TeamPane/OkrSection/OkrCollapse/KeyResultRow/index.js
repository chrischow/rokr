import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useObjectives } from "../../../../../shared/hooks/useObjectives";
import { getDate } from "../../../../../shared/utils/dates";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import ProgressBar from "../../../../../shared/ProgressBar";
import SharedModal from "../../../../../shared/SharedModal";
import KeyResultInfo from "./KeyResultInfo";
import KeyResultForm from "../../../../../shared/KeyResultForm";
import DeleteForm from "../../../../../shared/DeleteForm";

import './styles.css';

export default function KeyResultRow(props) {

  // State
  const [showKrInfoModal, setShowKrInfoModal] = useState(false);
  const [showKrEditModal, setShowKrEditModal] = useState(false);
  const [showKrDeleteModal, setShowKrDeleteModal] = useState(false);
  
  // Invalidate data
  const queryClient = useQueryClient();
  const invalidateKeyResults = () => {
    queryClient.invalidateQueries(['keyResults', 'team', props.team], { refetchInactive: true });
  };

  const invalidateUpdates = () => {
    queryClient.invalidateQueries(['updates', 'team', props.team], { refetchInactive: true });
  };

  // KR EDIT FORM
  // Form values
  const [krFormValues, setKrFormValues] = useState({
    Id: props.Id,
    Title: props.Title,
    krDescription: props.krDescription ? props.krDescription : '',
    krStartDate: getDate(props.krStartDate),
    krEndDate: getDate(props.krEndDate),
    minValue: props.minValue,
    maxValue: props.maxValue,
    currentValue: props.currentValue,
    parentObjective: props.parentObjective.Id
  });

  // Update form in response to Id
  useEffect(() => {
    setKrFormValues(prevData => {
      return {
        ...prevData,
        Id: props.Id,
        Title: props.Title,
        krDescription: props.krDescription ? props.krDescription : '',
        krStartDate: getDate(props.krStartDate),
        krEndDate: getDate(props.krEndDate),
        minValue: props.minValue,
        maxValue: props.maxValue,
        currentValue: props.currentValue,
        parentObjective: props.parentObjective.Id
      }
    });
  }, [props]);

  // Get objectives
  const objectives = useObjectives()
  const objectiveOptions = objectives.isSuccess && objectives.data.map(obj => {
    return {
      value: obj.Id,
      label: `[${obj.team} ${obj.frequency} - ${getDate(obj.objectiveEndDate)}] ${obj.Title}`
    };
  })

  // Handle closing of modal
  const handleCloseKrEditModal = () => {
    setKrFormValues({
      Id: props.Id,
      Title: props.Title,
      krDescription: props.krDescription ? props.krDescription : '',
      krStartDate: getDate(props.krStartDate),
      krEndDate: getDate(props.krEndDate),
      minValue: props.minValue,
      maxValue: props.maxValue,
      currentValue: props.currentValue,
      parentObjective: props.parentObjective.Id
    });
    setShowKrEditModal(false);
  }

  // Render KR info
  const viewKrInfo = () => <KeyResultInfo {...props} />;

  const editKr = () => {
    return <KeyResultForm
      formValues={krFormValues}
      setFormValues={setKrFormValues}
      objectiveOptions={objectiveOptions}
      selectDisabled={false}
      formCleanup={() => {
        // Invalidate and refetch data
        invalidateKeyResults();
        // Close modal
        setShowKrEditModal(false);
      }}
      closeModal={handleCloseKrEditModal}
      openDeleteModal={() => setShowKrDeleteModal(true)}
      mode="edit"
    />;
  }

  // DELETE KR FORM
  // Close delete modal
  const handleCloseKrDeleteModal = () => {
    setShowKrDeleteModal(false);
  };

  const deleteKr = () => {
    return <DeleteForm
      Id={props.Id}
      Title={props.Title}
      itemType="Key Result"
      updateIds={props.updateIds}
      invalidateKeyResults={invalidateKeyResults}
      invalidateUpdates={invalidateUpdates}
      closeModal={handleCloseKrDeleteModal}
    />
  }

  return (
    <div className="keyresult-row">
      <Row className="align-items-center">
        <Col xs={5}>
          <div className="keyresult-row--title">
            {props.Title}
          </div>
        </Col>
        <Col xs={2} className="text-center">
          <div
            className="keyresult-row--action-btn keyresult-row--edit-text mb-1"
            onClick={() => setShowKrInfoModal(true)}
          >
            <span className="keyresult-row--action-btn-text">View</span>
            {props.nLatestUpdates > 0 && 
              <span className="keyresult-row--new-updates"> ({props.nLatestUpdates} New)</span>
            }
          </div>
          <div
            className="keyresult-row--action-btn keyresult-row--edit-text"
            onClick={() => setShowKrEditModal(true)}
          >
            <span className="keyresult-row--action-btn-text">Edit</span>
          </div>
        </Col>
        <Col xs={2} className="text-center">
          <span className="keyresult-row--text">{getDate(props.krEndDate)}</span>
        </Col>
        <Col xs={3} className="keyresult-row--progress-bar">
          <ProgressBar progress={props.progress} isKeyResult={true} />
        </Col>
      </Row>
      <SharedModal
        modalTitle="Key Result Details"
        show={showKrInfoModal}
        onHide={() => setShowKrInfoModal(false)}
        renderModalContent={() => viewKrInfo()}
        handleCloseModal={() => setShowKrInfoModal(false)}
      />
      <SharedModal
        modalTitle="Edit Key Result"
        show={showKrEditModal}
        onHide={() => setShowKrEditModal(false)}
        renderModalContent={() => editKr()}
        handleCloseModal={handleCloseKrEditModal}
      />
      <SharedModal
        modalTitle="Delete Key Result"
        show={showKrDeleteModal}
        onHide={handleCloseKrDeleteModal}
        renderModalContent={() => deleteKr()}
        handleCloseModal={() => setShowKrDeleteModal(false)}
      />
    </div>
  );
}