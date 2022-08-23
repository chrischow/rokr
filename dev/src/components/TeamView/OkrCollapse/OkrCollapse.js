import { useEffect, useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
import ObjectiveCard from "../ObjectiveCard/ObjectiveCard";
import KeyResultRow from "../KeyResultRow/KeyResultRow";
import $ from 'jquery';

export default function OkrCollapse(props) {
  // Expand state
  const [isClicked, setIsClicked] = useState(true);

  // ID
  const objId = `obj-${props.objective.Id}`;
  const krRows = props.keyResults.map(kr => {
    const nLatestUpdates = 10;
    return <KeyResultRow
      // key={`kr-row-${kr.Id}`}
      objId={objId}
      nLatestUpdates={nLatestUpdates}
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
  
  return (
    <div className="mt-4">
      <ObjectiveCard
        isClicked={isClicked}
        setIsClicked={setIsClicked}
        objId={objId}
        progress={objProgress}
        team={props.team}
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