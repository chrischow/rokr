import { useState, useEffect } from "react";
import { computeMetrics } from "../../../utils/stats";
import { getMonth, getQuarter, getWorkYear, getYear, offsetDate, testPeriodEquality } from "../../../utils/dates";
import slugify from 'slugify';
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import FreqDropdown from "../FreqDropdown/FreqDropdown";
import TeamProgress from "../TeamProgress/TeamProgress";
import OkrSection from "../OkrSection/OkrSection";

export default function TeamPane(props) {
  /**
   * The TeamPane component comprises everything below the Monthly | Quarterly | Annual tabs.
   * This includes:
   *  - Dropdown menu
   *  - TeamProgress card to show objectives and key results progress
   * 
   * To ensure the correct (monthly/quarterly/annual) data is presented, it holds the following:
   *  - State for selected month / quarter / work year
   */

  // Dropdown options - staff is for monthly only
  const [dateOption, setDateOption] = useState('');
  const [staffOption, setStaffOption] = useState('');
  const [currentObjectives, setCurrentObjectives] = useState([]);
  const [currentKeyResults, setCurrentKeyResults] = useState([]);

  useEffect(() => {
    // Compute default date option
    const today = offsetDate(new Date());
    const year = getYear(today);
    const workyear = getWorkYear(today);
    const initialFreq = props.freq === 'annual'
      ? workyear
      : props.freq === 'quarterly'
        ? getQuarter(today, workyear)
        : getMonth(today, year);
    setDateOption(initialFreq);

    if (props.staffList) {
      setStaffOption(props.staffList[0]);
    }
  }, [])

  useEffect(() => {
    let objectives = props.objectives.filter(obj => {
      return (obj.frequency === props.freq) && 
        testPeriodEquality(obj.objectiveEndDate, dateOption, props.freq)
    });
    
    // Monthly only
    if (props.staffList) {
      objectives = objectives.filter(obj => obj.owner === staffOption);
    }

    const keyResults = props.keyResults.filter(kr => {
      return objectives.map(obj => obj.Id).includes(kr.parentObjective.Id);
    });

    setCurrentObjectives(objectives);
    setCurrentKeyResults(keyResults);
  }, [dateOption, props.freq, props.objectives, props.keyResults, props.staffList, staffOption])

  // Create staff tabs for monthly
  const staffTabs = props.staffList && props.staffList.map(staff => {
    return (
      <Nav.Link 
        key={`tab-${slugify(staff)}`}
        eventKey={slugify(staff)}
        className="individual-tabs--link"
        onClick={() => setStaffOption(staff)}
      >
        {staff}
      </Nav.Link>
    );
  });
  
  return (
    <>
      {props.freq === 'monthly' && props.staffList.length > 0 &&
        <>
          <Tab.Container id="individual-tabs" defaultActiveKey={slugify(props.staffList[0])}>
            <Nav className="justify-content-center">
              <Nav.Item>
                {staffTabs}
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </>
      }
      <FreqDropdown freq={props.freq} options={props.subgroups} dateOption={dateOption} setDateOption={setDateOption} />
      <TeamProgress
        freq={props.freq}
        data={computeMetrics(
          currentObjectives,
          currentKeyResults,
          props.freq
        )}
      />
      <OkrSection
        teamName={props.teamName}
        freq={props.freq}
        staffOption={staffOption}
        dateOption={dateOption}
        objectives={currentObjectives}
        keyResults={currentKeyResults}
      />
    </>
  );
}