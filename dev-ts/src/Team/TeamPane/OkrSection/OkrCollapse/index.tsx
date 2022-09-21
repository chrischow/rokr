import { useEffect, useState } from "react";
import $ from 'jquery';
import Collapse from 'react-bootstrap/Collapse';
import { sortByTitle } from "../../../shared/utils/dataProcessing";
import { KeyResult, Objective, Update } from "../../../shared/types";
import ObjectiveCard from "./ObjectiveCard";
import KeyResultRow from "./KeyResultRow";

interface OkrCollapseProps {
  objective: Objective;
  keyResults: KeyResult[];
  updateData: Update[];
  team: string;
  startDate: string;
  endDate: string;
  overallIsClicked: boolean;
  dateOption: string;
}

export default function OkrCollapse(props: OkrCollapseProps) {
  // Expand state
  const [isClicked, setIsClicked] = useState(true);

  // ID
  const objId = `obj-${props.objective.Id}`;
  const krRows = props.keyResults.sort(sortByTitle).map(kr => {
    const krUpdates = props.updateData.filter(update => {
      return update.parentKrId === kr.Id;
    });
    const nLatestUpdates = krUpdates.filter(update => {
      // Get update's date
      let updateDate = new Date(update.updateDate);
      // Get today's date
      let maxDate = new Date();
      // Get today's date minus 7 days
      let minDate = new Date();
      minDate.setDate(minDate.getDate() - 7);
      // Check condition
      return updateDate >= minDate && updateDate <= maxDate;
    }).length;
    return <KeyResultRow
      team={props.team}
      nLatestUpdates={nLatestUpdates}
      updateIds={krUpdates.map(update => update.Id)}
      startDate={props.startDate}
      endDate={props.endDate}
      {...kr}
      progress={kr.currentValue / kr.maxValue}
    />
  })

  // Initialise collapse
  useEffect(() => {
    setIsClicked(props.overallIsClicked);
  }, [props.overallIsClicked]);
  // Collapse
  
  useEffect( () => {
    $(function() {
      $(`#${objId}`).on('show.bs.collapse', () => setIsClicked(true));
      $(`#${objId}`).on('hide.bs.collapse', () => setIsClicked(false));
    });
  });

  // Compute stats
  const objProgress = props.keyResults.length > 0  ? 
    props.keyResults
      .map(kr => kr.currentValue / kr.maxValue)
      .reduce((a, b) => a + b) / props.keyResults.length
    : 0;

  // Prepare key results and update data
  const keyResultIds = props.keyResults.map(kr => kr.Id);
  const updateIds = props.updateData.filter(update => {
    return keyResultIds.includes(update.parentKrId);
  }).map(update => update.Id);

  return (
    <div className="mt-4">
      <ObjectiveCard
        isClicked={isClicked}
        setIsClicked={setIsClicked}
        objId={objId}
        progress={objProgress}
        keyResultIds={keyResultIds}
        updateIds={updateIds}
        {...props.objective}
      />
      <Collapse in={isClicked}>
        <div id={objId}>
          {krRows}
        </div>
      </Collapse>
    </div>
  );
}