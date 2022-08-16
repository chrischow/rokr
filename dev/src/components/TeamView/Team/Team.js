import { useQueryClient } from 'react-query';
import { useTeamObjectivesCache, useTeamObjectives } from "../../../hooks/useObjectives";
import { useTeamKeyResultsCache, useTeamKeyResults } from "../../../hooks/useKeyResults";
import { getStaffFromObjectives, getSubGroupsFromObjectives } from "../../../utils/stats";
import slugify from "slugify";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import TeamProgress from "../TeamProgress/TeamProgress";
import TeamPane from "../TeamPane/TeamPane";

import './Team.css';

export default function Team(props){
  // Get objectives and key results data - try cache first
  const queryClient = useQueryClient()
  
  const getData = (queryState, getFn, getFromCacheFn) => {
    if (queryState) {
      return getFn;
    } else {
      return getFromCacheFn;
    }
  }

  const objectives = getData(
    queryClient.getQueryState('objectives'),
    useTeamObjectives,
    useTeamObjectivesCache
  )(props.team.teamName);
  
  const keyResults = getData(
    queryClient.getQueryState('keyResults'),
    useTeamKeyResults,
    useTeamKeyResultsCache
  )(props.team.teamName);

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

  // Staff tabs
  const staffTabs = objectives.isSuccess && staffList.map(staff => {
    return (
      <Nav.Link key={`tab-${slugify(staff)}`} eventKey={slugify(staff)} className="individual-tabs--link">
        {staff}
      </Nav.Link>
    );
  });

  return (
    <>
      <h1 className="teampage-title">{props.team.teamName}</h1>
      <div className="mt-4">
        <Tab.Container id="frequency-tabs" defaultActiveKey="monthly">
          <Nav className="justify-content-center">
            <Nav.Item>
              {frequencyTabs}
            </Nav.Item>
          </Nav>
          <div className="mt-4">
            <Tab.Content>
              <Tab.Pane eventKey="monthly">
                {/* Staff tabs */}
                {staffList.length > 0 &&
                  <>
                    <Tab.Container id="individual-tabs" defaultActiveKey={slugify(staffList[0])}>
                      <Nav className="justify-content-center">
                        <Nav.Item>
                          {staffTabs}
                        </Nav.Item>
                      </Nav>
                    </Tab.Container>
                  </>
                }
                <TeamProgress 
                  freq="monthly"
                />
              </Tab.Pane>
              <Tab.Pane eventKey="quarterly">
                {objectives.isSuccess && keyResults.isSuccess &&
                  <TeamPane 
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