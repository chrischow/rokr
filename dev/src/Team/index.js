import { useTeamObjectives } from "../shared/hooks/useObjectives";
import { useTeamKeyResults } from "../shared/hooks/useKeyResults";
import { useTeamUpdates } from '../shared/hooks/useUpdates';
import slugify from "slugify";
import { getStaffFromObjectives, getSubGroupsFromObjectives } from "../shared/utils/stats";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import TeamPane from "./TeamPane";

import './styles.css';

export default function Team(props){
  const objectives = useTeamObjectives(props.team.teamName);
  const keyResults = useTeamKeyResults(props.team.teamName);
  const updates = useTeamUpdates(props.team.teamName);

  // Extract options
  const staffList = objectives.isSuccess && getStaffFromObjectives(objectives.data);
  const subgroups = objectives.isSuccess && getSubGroupsFromObjectives(objectives.data);

  // Frequency tabs
  const freqs = ['Monthly', 'Quarterly', 'Annual'];
  const frequencyTabs = freqs.map(freq => {
    return (
      <Nav.Link key={`tab-${slugify(freq)}`} eventKey={freq.toLowerCase()} className="frequency-tabs--link">
        {freq}
      </Nav.Link>
    )
  });

  return (
    <>
      <h1 className="teampage-title">{props.team.teamName}</h1>
      <div className="mt-2">
        <Tab.Container id="frequency-tabs" defaultActiveKey="monthly">
          <Nav className="justify-content-center">
            <Nav.Item>
              {frequencyTabs}
            </Nav.Item>
          </Nav>
          <div className="mt-4">
            <Tab.Content>
              <Tab.Pane eventKey="monthly">
                {objectives.isSuccess && keyResults.isSuccess &&
                  <TeamPane
                    teamName={props.team.teamName}
                    freq="monthly"
                    subgroups={subgroups['monthly']}
                    objectives={objectives.data}
                    keyResults={keyResults.data}
                    staffList={staffList}
                  />
                }
              </Tab.Pane>
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