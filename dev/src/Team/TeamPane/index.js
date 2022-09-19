import { useState, useEffect } from "react";
import { computeMetrics } from "../../shared/utils/stats";
import { getMonth, getQuarter, getWorkYear, getYear, offsetDate, testPeriodEquality } from "../../shared/utils/dates";
import slugify from 'slugify';
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import FreqDropdown from "./FreqDropdown";
import TeamProgress from "./TeamProgress";
import OkrSection from "./OkrSection";

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
  }, [props.freq])

  useEffect(() => {
    let objectives = props.objectives.filter(obj => {
      return (obj.frequency === props.freq) && 
        testPeriodEquality(obj.objectiveEndDate, dateOption, props.freq)
    });

    const keyResults = props.keyResults.filter(kr => {
      return objectives.map(obj => obj.Id).includes(kr.parentObjective.Id);
    });

    setCurrentObjectives(objectives);
    setCurrentKeyResults(keyResults);
  }, [dateOption, props.freq, props.objectives, props.keyResults, staffOption])
  
  return (
    <>
      {props.teamName === 'RAiD' && props.freq === 'quarterly' && 
        <FreqDropdown freq={props.freq} options={props.subgroups} dateOption={dateOption} setDateOption={setDateOption} />
      }
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
        dateOption={dateOption}
        objectives={currentObjectives}
        keyResults={currentKeyResults}
      />
    </>
  );
}