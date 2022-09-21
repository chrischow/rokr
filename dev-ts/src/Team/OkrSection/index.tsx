import { useEffect, useState } from 'react';
import $ from 'jquery';
import { IconContext } from 'react-icons';
import { RiAddFill } from 'react-icons/ri';
import { useTeamUpdates } from '../../shared/hooks/useUpdates';
import { quarterToIsoDate, monthToIsoDate, yearToIsoDate } from '../../shared/utils/dates';
import { sortByTitle } from '../../shared/utils/dataProcessing';
import SharedModal from '../../shared/SharedModal';
import OkrCollapse from "./OkrCollapse";
import ObjectiveAdd from './ObjectiveAdd';

import './styles.css';
import { KeyResult, Objective } from '../../shared/types';

interface OkrSectionProps {
  objectives: Objective[];
  keyResults: KeyResult[];
  teamName: string;
  freq: string;
  dateOption: string;
  staffOption: string;
}

export default function OkrSection(props: OkrSectionProps) {

  // State
  const [overallIsClicked, setOverallIsClicked] = useState<boolean>(true);
  const [showObjectiveModal, setShowObjectiveModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
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

    $('.btn-collapse').each(function(this: any) {
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
    staffOption={props.staffOption}
  />

  // Create OKR Collapse objects
  const okrCollapses = props.objectives.sort(sortByTitle).map((obj: Objective) => {
    const keyResults = props.keyResults.filter((kr: KeyResult) => kr.parentObjective.Id === obj.Id);

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
            <div className="d-flex align-items-center">
              <span className="me-1">Add Objective</span>
              <IconContext.Provider value={{ className: "btn-okr-toggle-icon" }}>
                <RiAddFill />
              </IconContext.Provider>
            </div>
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