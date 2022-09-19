import { useTeamObjectives } from "../shared/hooks/useObjectives";
import { useTeamKeyResults } from "../shared/hooks/useKeyResults";
import { useTeamUpdates } from '../shared/hooks/useUpdates';
import { getSubGroupsFromObjectives } from "../shared/utils/stats";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import TeamPane from "./TeamPane";

import './styles.css';

export default function Team(props){
  const objectives = useTeamObjectives(props.team.teamName);
  const keyResults = useTeamKeyResults(props.team.teamName);
  const updates = useTeamUpdates(props.team.teamName);

  // Extract options
  const subgroups = objectives.isSuccess && getSubGroupsFromObjectives(objectives.data);

  return (
    <>
      <h1 className="teampage-title">{props.team.teamName}</h1>
      <div className="mt-2">
        <Tab.Container id="frequency-tabs" defaultActiveKey="annual">
          <Nav className="justify-content-center">
            <Nav.Item>
              {props.team.teamName === 'RAiD' &&
                <>
                  <Nav.Link key={`tab-quarterly`} eventKey='quarterly' className="frequency-tabs--link">
                    Quarterly
                  </Nav.Link>
                  <Nav.Link key={`tab-annual`} eventKey='annual' className="frequency-tabs--link">
                    Annual
                  </Nav.Link>
                </>
              }
            </Nav.Item>
          </Nav>
          <div className="mt-4">
            <Tab.Content>
              {props.team.teamName === 'RAiD' && 
                <Tab.Pane eventKey="quarterly">
                  {objectives.isSuccess && keyResults.isSuccess &&
                    <TeamPane
                      teamName={props.team.teamName}
                      freq="quarterly"
                      subgroups={subgroups['quarterly']}
                      objectives={objectives.data}
                      keyResults={keyResults.data}
                    />
                  }
                </Tab.Pane>
              }
              <Tab.Pane eventKey="annual">
                {objectives.isSuccess && keyResults.isSuccess && 
                  <TeamPane
                    teamName={props.team.teamName}
                    freq="annual"
                    subgroups={subgroups['annual']}
                    objectives={objectives.data}
                    keyResults={keyResults.data}
                  />
                }
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>
    </>
  );
}