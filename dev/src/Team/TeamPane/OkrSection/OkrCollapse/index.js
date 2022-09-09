import { useEffect, useState } from "react";
import $ from 'jquery';
import Collapse from 'react-bootstrap/Collapse';
import ObjectiveCard from "./ObjectiveCard";
import KeyResultRow from "./KeyResultRow";
import { sortByTitle } from "../../../../utils/dataProcessing";

export default function OkrCollapse(props) {
  // Expand state
  const [isClicked, setIsClicked] = useState(true);

  // ID
  const objId = `obj-${props.objective.Id}`;
  const krRows = props.keyResults.sort(sortByTitle).map(kr => {
    const krUpdates = props.updateData.filter(update => {
      return update.parentKrId === kr.Id;
    });
    const nLatestUpdates = krUpdates.length;
    return <KeyResultRow
      // key={`kr-row-${kr.Id}`}
      objId={objId}
      team={props.team}
      nLatestUpdates={nLatestUpdates}
      updateIds={krUpdates.map(update => update.Id)}
      startDate={props.startDate}
      endDate={props.endDate}
      updateData={krUpdates}
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
        team={props.team}
        dateOption={props.dateOption}
        startDate={props.startDate}
        endDate={props.endDate}
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