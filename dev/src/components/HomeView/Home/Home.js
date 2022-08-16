import { useState, useEffect } from "react";
import { useObjectives } from "../../../hooks/useObjectives";
import { useKeyResults } from "../../../hooks/useKeyResults";
import updateCircleProgress from "../../../utils/circleProgress";
import {
  computeMetrics, computeTeamsMetrics
} from "../../../utils/stats";
import { Brand } from "../../NavBarBrand/NavBarBrand";
import ProgressCard from "../../ProgressCard/ProgressCard";
import HomeTeamCards from "../HomeTeamCards/HomeTeamCards";

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
      // Initialise overall progress card
      if (overallProgressData) {
        updateCircleProgress(
          "overall_progress",
          overallProgressData.avgCompletion,
          200,
          "50px",
          "#000718"
        );
      }
      
      // Initialise team progress cards
      if (allTeamsProgressData) {
        props.teams.map(team => {
          updateCircleProgress(
            team.slug,
            allTeamsProgressData[team.teamName].avgCompletion,
            160,
            "35px",
            "#010D1E"
          );
          return null;
        })
      }
    },
    [props.teams, overallProgressData, allTeamsProgressData]
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
      {!overallProgressData && 
        <div className="overall-panel mt-4 text-center align-items-center">
          <span className="no-data">No data to display.</span>
        </div>
      }
      <h2 className="mt-5">
        Teams
      </h2>
      {allTeamsProgressData &&
        <HomeTeamCards
          teams={props.teams}
          allTeamsProgressData={allTeamsProgressData}
        />
      }

      {!allTeamsProgressData && 
        <div className="overall-panel mt-4 text-center align-items-center">
          <span className="no-data">No data to display.</span>
        </div>
      }
    </>
  );
}