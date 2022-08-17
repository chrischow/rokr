import { useEffect, useState } from 'react';
import $ from 'jquery';
import { quarterToIsoDate, monthToIsoDate, yearToIsoDate } from '../../../utils/dates';
import { AddIconText } from "../../Icons/Icons";
import ObjectiveForm from '../../ObjectiveForm/ObjectiveForm';
import SharedModal from '../../SharedModal/SharedModal';
import OkrCollapse from "../OkrCollapse/OkrCollapse";

import './OkrSection.css';

export default function OkrSection(props) {

  // State
  const [overallIsClicked, setOverallIsClicked] = useState(true);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [objectiveMode, setObjectiveMode] = useState('new');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Create OKR Collapse objects
  const okrCollapses = props.objectives.map(obj => {
    const keyResults = props.keyResults.filter(kr => kr.parentObjective.Id === obj.Id);
    return (
      <OkrCollapse
        // key={`okrcollapse-${obj.Id}`}
        objective={obj}
        keyResults={keyResults}
        overallIsClicked={overallIsClicked}
      />
    );
  })

  // Event handlers
  const toggleOKRCards = () => {
    setOverallIsClicked(prevState => !prevState);

    $('.btn-collapse').each(() => {
      let caret = $(this);
      caret.toggleClass('rotated');
    });
  }

  // Get start/end date
  useEffect(() => {
    if (props.freq === 'monthly') {
      setStartDate(monthToIsoDate(props.dateOption, true));
      setEndDate(monthToIsoDate(props.dateOption, false));
    } else if (props.freq === 'quarterly') {
      setStartDate(quarterToIsoDate(props.dateOption, true));
      setEndDate(quarterToIsoDate(props.dateOption, false));
    } else if (props.freq === 'annual') {
      setStartDate(yearToIsoDate(props.dateOption, true));
      setEndDate(yearToIsoDate(props.dateOption, false));
    }
  }, [props.freq, props.dateOption]);

  // Form values
  const [objectiveFormValues, setObjectiveFormValues] = useState({
    Title: '',
    objectiveDescription: '',
    objectiveStartDate: startDate,
    objectiveEndDate: endDate,
    frequency: props.freq,
    team: props.teamName,
    owner: props.staffOption ? props.staffOption : ''
  });

  // Update form values based on the things that can change
  useEffect(() => {
    setObjectiveFormValues(prevData => {
      return {
        ...prevData,
        objectiveStartDate: startDate,
        objectiveEndDate: endDate,
        frequency: props.freq,
        team: props.teamName,
        owner: props.staffOption ? props.staffOption : ''
      };
    });
  }, [props.freq, props.teamName, props.staffOption, startDate, endDate])

  const addObjective = () => {
    return <ObjectiveForm
      formValues={objectiveFormValues}
      setFormValues={setObjectiveFormValues}
      setShowObjectiveModal={setShowObjectiveModal}
      mode='new'
    />;
  }

  const handleCloseModal = () => {
    setObjectiveFormValues({
      Title: '',
      objectiveDescription: '',
      objectiveStartDate: startDate,
      objectiveEndDate: endDate,
      frequency: props.freq,
      team: props.teamName,
      owner: props.staffOption ? props.staffOption : ''
    });
    setShowObjectiveModal(false);
    setObjectiveMode('new');
  }

  return (
    <>
      <h3 className="mt-5">Objectives & Key Results</h3>
      <div className="mb-4 mt-3">
        <button className="btn btn-okr-toggle" onClick={toggleOKRCards}>
          Expand/Collapse
        </button>
        <div className="float-end">
          <button className="btn btn-green" onClick={() => setShowObjectiveModal(prevState => !prevState)}>
            <span className="me-1">Add Objective</span>
            <AddIconText className="btn-okr-toggle-icon" />
          </button>
        </div>
      </div>
      {okrCollapses}
      <SharedModal
        modalTitle={`${objectiveFormValues.Id ? 'Edit' : 'New'} Objective`}
        show={showObjectiveModal}
        onHide={() => setShowObjectiveModal(false)}
        renderModalContent={() => addObjective()}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}