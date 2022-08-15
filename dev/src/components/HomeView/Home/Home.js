import { useState, useEffect } from "react";
import { useObjectives } from "../../../hooks/useObjectives";
import { useKeyResults } from "../../../hooks/useKeyResults";
import updateCircleProgress from "../../../utils/circleProgress";
import {
  computeMetrics, computeTeamsMetrics
} from "../../../utils/stats";
import { Brand } from "../../NavBarBrand/NavBarBrand";
import ProgressCard from "../../ProgressCard/ProgressCard";

import './Home.css';

export default function Home(props) {
  // Set state
  // const [metrics, setMetrics] = useState({});

  // Get data
  const objectives = useObjectives();
  const keyResults = useKeyResults();

  // Compute statistics once data is retrieved
  const overallProgressData = objectives.isSuccess && keyResults.isSuccess ?
    computeMetrics(objectives.data, keyResults.data, 'annual') : null;

  const allTeamsProgressData = objectives.isSuccess && keyResults.isSuccess ?
    computeTeamsMetrics(props.teams, objectives.data, keyResults.data, 'annual') : null;

  // Render progress cards when metrics change
  useEffect(
    () => {
      if (overallProgressData) {
        updateCircleProgress(
          "overall_progress",
          overallProgressData.avgCompletion,
          200,
          "50px",
          "#000718"
        );
      }
    },
    [overallProgressData, allTeamsProgressData]
  )

  return (
    <>
      <h1>
        <Brand />
      </h1>
      <h2 className="mt-4">
        Overall Progress
      </h2>
      {overallProgressData &&
        <div className="overall-panel mt-4">
          <ProgressCard
            progressId="overall_progress"
            data={overallProgressData}
            isTeam={false}
          />
        </div>
      }
      <h2 className="mt-5">
        Teams
      </h2>
    </>
  );
}