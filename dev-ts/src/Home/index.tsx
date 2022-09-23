import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TeamInfo, ProgressCardData } from '../shared/types';
import { useObjectivesByFreq } from "../shared/hooks/useObjectives";
import { useKeyResultsByFreq } from "../shared/hooks/useKeyResults";
import updateCircleProgress from "../shared/utils/circleProgress";
import {
  computeMetrics, computeTeamsMetrics
} from "../shared/utils/stats";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Brand } from "../shared/Brand";
import ProgressCard from "../shared/ProgressCard";
import { config } from "../config";

import './styles.css';

interface HomeProps {
  teams: TeamInfo[];
}

interface CardProps {
  teamName: string;
  slug: string;
  data: ProgressCardData;
}

export default function Home(props: HomeProps) {
  // Get data
  const objectives = useObjectivesByFreq('annual');
  const keyResults = useKeyResultsByFreq('annual');

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
          // Switch second argument of updateCircleProgress to following line to use overall data
          // overallProgressData.avgCompletion
          allTeamsProgressData[config.teams[0].teamName].avgCompletion,
          200,
          "50px",
          "#000718"
        );
      }
      
      // Initialise team progress cards
      if (allTeamsProgressData) {
        props.teams.forEach(team => {
          // Remove condition to update circle progress for all team cards
          if (team.teamName !== config.teams[0].teamName) {
            updateCircleProgress(
              team.slug,
              allTeamsProgressData[team.teamName].avgCompletion,
              160,
              "35px",
              "#010D1E"
            );
          }
        })
      }
    },
    [props.teams, overallProgressData, allTeamsProgressData]
  )
  
  // Card component
  function Card(props: CardProps) {
    const navigate = useNavigate();
    const goToTeamPage = () => {
      return navigate('/' + props.slug);
    }
  
    return (
      <Col xs={6} className="card--outer" onClick={goToTeamPage}>
        <div className="card--inner">
          <h4 className="card--header text-center mb-3">{props.teamName}</h4>
          <ProgressCard progressId={props.slug} data={props.data} isTeam={true} />
        </div>
      </Col>
    );
  }

  // Link to RAiD page
  const navigate = useNavigate();
  const goToTeamPage = () => {
    return navigate(`/${config.teams[0].slug}`);
  }
  
  return (
    <>
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
            // data={overallProgressData}
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
        <Row className="align-items-center mt-3 mx-auto">
          {
            props.teams.map(team => {
              // Remove condition to render all team cards
              if (team.teamName !== config.teams[0].teamName) {
                return (
                  <Card
                    teamName={team.teamName}
                    key={`card-${team.slug}`}
                    slug={team.slug}
                    data={allTeamsProgressData[team.teamName]}
                  />
                );
              }
              return null;
            })
          }
        </Row>
      }

      {!allTeamsProgressData && 
        <div className="overall-panel mt-4 text-center align-items-center">
          <span className="no-data">No data to display.</span>
        </div>
      }
    </>
  );
}