import { useState, useEffect, useContext, useLayoutEffect } from "react";
import slugify from 'slugify';
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { computeMetrics } from "../../shared/utils/stats";
import { getMonth, getQuarter, getWorkYear, getYear, offsetDate, testPeriodEquality, isStartEndDateInDateOption } from "../../shared/utils/dates";
import { KeyResult, Objective } from "../../shared/types";
import FreqDropdown from "./FreqDropdown";
import TeamProgress from "./TeamProgress";
import OkrSection from "./OkrSection";
import { AppContext } from "../../shared/context/AppContextProvider";

interface TeamPaneProps {
  objectives: Objective[];
  keyResults: KeyResult[];
  teamName: string;
  freq: string;
  staffList?: (string | undefined)[];
  subgroups: string[];
}

export default function TeamPane(props: TeamPaneProps) {
  const [appContext, setAppContext] = useContext(AppContext);

  // Dropdown options - staff is for monthly only
  const [dateOption, setDateOption] = useState<string>('');
  const [staffOption, setStaffOption] = useState<string|undefined>('');
  const [currentObjectives, setCurrentObjectives] = useState<Objective[]>([]);
  const [currentKeyResults, setCurrentKeyResults] = useState<KeyResult[]>([]);

  // Handler for date
  useEffect(() => {
    // Check app state for last chosen date option first
    if (appContext.period[props.freq]) {
      // Set date option based on that
      setDateOption(appContext.period[props.freq]);
    } else {
      // Only if there is no last chosen date option, compute default date option
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
      // Update local state and global state
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
  }, [props.freq])

  // Handler for staff list
  useEffect(() => {
    if (props.staffList) {
      // Check app state for last chosen staff option
      if (props.staffList.includes(appContext.staff)) {
        // Set staff option based on that
        setStaffOption(appContext.staff);
      } else {
        // Update local state and global state
        setStaffOption(props.staffList[0]);
        setAppContext({ ...appContext, staff: props.staffList[0]});
      }
    }
  }, [props.staffList, appContext.staff])

  // When the data changes, update the page based on the current options
  useLayoutEffect(() => {
    let objectives = props.objectives.filter(obj => {
      return (obj.frequency === props.freq) && 
        testPeriodEquality(obj.objectiveStartDate, obj.objectiveEndDate, dateOption, props.freq)
    });
    
    // Monthly only
    if (props.freq === 'monthly') {
      objectives = objectives.filter(obj => obj.owner === staffOption);
    }

    const keyResults = props.keyResults.filter(kr => {
      return objectives.map(obj => obj.Id).includes(kr.parentObjective.Id) && 
        isStartEndDateInDateOption(offsetDate(kr.krStartDate), offsetDate(kr.krEndDate), dateOption);
    });

    setCurrentObjectives(objectives);
    setCurrentKeyResults(keyResults);
  }, [dateOption, props.freq, props.objectives, props.keyResults, staffOption])

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