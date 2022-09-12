import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useObjectives } from "../shared/hooks/useObjectives";
import { useKeyResults } from "../shared/hooks/useKeyResults";
import updateCircleProgress from "../utils/circleProgress";
import {
  computeMetrics, computeTeamsMetrics
} from "../utils/stats";
import Splash from '../shared/Splash';
import { Brand } from "../shared/Brand";
import ProgressCard from "../shared/ProgressCard";
import HomeTeamCards from "./HomeTeamCards";
import { config } from "../config";

import './styles.css';

export default function Home(props) {
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
      if (allTeamsProgressData) {
        updateCircleProgress(
          "overall_progress",
          allTeamsProgressData[config.teams[0].teamName].avgCompletion,
          200,
          "50px",
          "#000718"
        );
      }
      
      // Initialise team progress cards
      if (allTeamsProgressData) {
        props.teams.map(team => {
          if (team.teamName !== config.teams[0].teamName) {
            updateCircleProgress(
              team.slug,
              allTeamsProgressData[team.teamName].avgCompletion,
              160,
              "35px",
              "#010D1E"
            );
          }
          return null;
        })
      }
    },
    [props.teams, overallProgressData, allTeamsProgressData]
  )

  // Link to RAiD page
  const navigate = useNavigate();
  const goToTeamPage = () => {
    return navigate(`/${config.teams[0].slug}`);
  }
  
  return (
    <>
      {props.loading && <Splash loading={props.loading} />}
      <h1>
        <Brand />
      </h1>
      <h2 className="mt-4">
        {config.teams[0].teamName}
      </h2>
      {allTeamsProgressData &&
        <div className="overall-panel card--inner mt-4" onClick={goToTeamPage}>
          <ProgressCard
            progressId="overall_progress"
            data={allTeamsProgressData[config.teams[0].teamName]}
            isTeam={false}
          />
        </div>
      }
      {!allTeamsProgressData && 
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