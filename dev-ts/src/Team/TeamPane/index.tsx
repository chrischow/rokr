import { useState, useEffect, useContext } from "react";
import slugify from 'slugify';
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { computeMetrics } from "../../shared/utils/stats";
import { getMonth, getQuarter, getWorkYear, getYear, offsetDate, testPeriodEquality } from "../../shared/utils/dates";
import { KeyResult, Objective } from "../../shared/types";
import FreqDropdown from "./FreqDropdown";
import TeamProgress from "./TeamProgress";
import OkrSection from "./OkrSection";
import { AppContext } from "../../shared/contexts/AppContextProvider";

interface TeamPaneProps {
  objectives: Objective[];
  keyResults: KeyResult[];
  teamName: string;
  freq: string;
  staffList?: (string | undefined)[];
  subgroups: string[];
}

export default function TeamPane(props: TeamPaneProps) {
  /**
   * The TeamPane component comprises everything below the Monthly | Quarterly | Annual tabs.
   * This includes:
   *  - Dropdown menu
   *  - TeamProgress card to show objectives and key results progress
   * 
   * To ensure the correct (monthly/quarterly/annual) data is presented, it holds the following:
   *  - State for selected month / quarter / work year
   */
  const [appContext, setAppContext] = useContext(AppContext);

  // Dropdown options - staff is for monthly only
  const [dateOption, setDateOption] = useState<string>('');
  const [staffOption, setStaffOption] = useState<string|undefined>('');
  const [currentObjectives, setCurrentObjectives] = useState<Objective[]>([]);
  const [currentKeyResults, setCurrentKeyResults] = useState<KeyResult[]>([]);

  useEffect(() => {
    // Check app state for date option first
    if (appContext.period[props.freq]) {
      // Set date option based on currently set period
      setDateOption(appContext.period[props.freq]);
    } else {
      // Compute default date option
      const today = offsetDate(new Date());
      const year = getYear(today);
      const workyear = getWorkYear(today);
      let initialFreq: string;
      if (props.freq === 'annual') {
        initialFreq = workyear;
      } else if (props.freq === 'quarterly') {
        initialFreq = getQuarter(today, workyear);
      } else {
        initialFreq = getMonth(today, year);
      }
      // Update current state and global state
      console.log('Setting', initialFreq);
      setDateOption(initialFreq);
      setAppContext((prevData: any) => {
        return {
          ...prevData,
          period: {
            ...prevData.period,
            [props.freq]: initialFreq
          }
        };
      })
    }

    if (props.staffList) {
      if (props.staffList.includes(appContext.staff)) {
        setStaffOption(appContext.staff);
      } else {
        setStaffOption(props.staffList[0]);
        setAppContext({ ...appContext, staff: props.staffList[0]});
      }
    }
  }, [props.freq, props.staffList, appContext.staff])

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
  const staffTabs = props.staffList && props.staffList.map((staff) => {
    return (
      <Nav.Link 
        key={`tab-${slugify(staff ? staff : '')}`}
        eventKey={slugify(staff ? staff : '')}
        className="individual-tabs--link"
        onClick={() => {
          setStaffOption(staff);
          setAppContext({...appContext, staff: staff});
        }}
      >
        {staff}
      </Nav.Link>
    );
  });
  
  return (
    <>
      {props.freq === 'monthly' && props.staffList && props.staffList.length > 0 &&
        <>
          <Tab.Container
            id="individual-tabs"
            defaultActiveKey={slugify(staffOption ? staffOption : '')}
            activeKey={staffOption ? slugify(staffOption): ''}
          >
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
        staffOption={staffOption ? staffOption: ''}
        dateOption={dateOption}
        objectives={currentObjectives}
        keyResults={currentKeyResults}
      />
    </>
  );
}