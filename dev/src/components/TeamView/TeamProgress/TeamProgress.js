import { useEffect } from 'react';
import ProgressCard from "../../ProgressCard/ProgressCard";
import updateCircleProgress from "../../../utils/circleProgress";

export default function TeamProgress(props) {
  useEffect(() => {
    if (props.data) {
      updateCircleProgress(
        `team-progress-${props.freq}`,
        props.data.avgCompletion ? props.data.avgCompletion : 0,
        200,
        "50px",
        "#000718"
      );
    }
  }, [props.data, props.freq])
  
  return (
    <>
      <h3 className="mt-1">{props.freq === 'monthly' ? 'Individual' : 'Team'} Progress</h3>
      <div className="overall-panel mt-4">
        {props.data &&
          <ProgressCard
            progressId={`team-progress-${props.freq}`}
            data={props.data}
            isTeam={false}
          />
        }
        {!props.data &&
          <div className="text-center">
            <span className="no-data">No data to display.</span>
          </div>
        }
      </div>
    </>
  );
}