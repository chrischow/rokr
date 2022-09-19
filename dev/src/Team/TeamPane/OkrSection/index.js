import { useEffect, useState } from 'react';
import $ from 'jquery';
import { useTeamUpdates } from '../../../shared/hooks/useUpdates';
import { quarterToIsoDate, monthToIsoDate, yearToIsoDate } from '../../../shared/utils/dates';
import { sortByTitle } from '../../../shared/utils/dataProcessing';
import { AddIconText } from "../../../shared/Icons";
import SharedModal from '../../../shared/SharedModal';
import OkrCollapse from "./OkrCollapse";
import ObjectiveAdd from './ObjectiveAdd';

import './styles.css';

export default function OkrSection(props) {

  // State
  const [overallIsClicked, setOverallIsClicked] = useState(true);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [updateData, setUpdateData] = useState([]);

  // Get updates data
  const updates = useTeamUpdates(props.teamName);
  useEffect( () => {
    if (updates.isSuccess) {
      setUpdateData(updates.data);
    }
  }, [props])

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

  // Handle closing of modal
  const handleCloseModal = () => {
    // setObjectiveFormValues({...defaultObjectiveValues});
    setShowObjectiveModal(false);
  }
  
  // Render modal content
  const addObjective = () => <ObjectiveAdd
    setShowObjectiveModal={setShowObjectiveModal}
    freq={props.freq}
    team={props.teamName}
    startDate={startDate}
    endDate={endDate}
  />

  // Create OKR Collapse objects
  const okrCollapses = props.objectives.sort(sortByTitle).map(obj => {
    const keyResults = props.keyResults.filter(kr => kr.parentObjective.Id === obj.Id);

    return (
      <OkrCollapse
        // key={`okrcollapse-${obj.Id}`}
        team={props.teamName}
        objective={obj}
        keyResults={keyResults}
        overallIsClicked={overallIsClicked}
        startDate={startDate}
        endDate={endDate}
        dateOption={props.dateOption}
        updateData={updateData}
      />
    );
  });

  return (
    <>
      <h3 className="mt-5">Objectives & Key Results</h3>
      <div className="mb-4 mt-3">
        <button className="btn btn-okr-toggle" onClick={toggleOKRCards}>
          Expand/Collapse
        </button>
        <div className="float-end">
          <button className="btn btn-green" onClick={() => setShowObjectiveModal(true)}>
            <span className="me-1">Add Objective</span>
            <AddIconText className="btn-okr-toggle-icon" />
          </button>
        </div>
      </div>
      {okrCollapses}
      <SharedModal
        modalTitle="New Objective"
        show={showObjectiveModal}
        onHide={() => setShowObjectiveModal(false)}
        renderModalContent={() => addObjective()}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}