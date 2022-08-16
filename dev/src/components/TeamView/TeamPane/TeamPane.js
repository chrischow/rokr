import { useState, useEffect } from "react";
import { computeMetrics } from "../../../utils/stats";
import { getMonth, getQuarter, getWorkYear, getYear, offsetDate, testPeriodEquality } from "../../../utils/dates";
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

  // Dropdown option
  const [dateOption, setDateOption] = useState('');
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
    const objectives = props.objectives.filter(obj => {
      return (obj.frequency === props.freq) && 
        testPeriodEquality(obj.objectiveEndDate, dateOption, props.freq)
    });
    
    const keyResults = props.keyResults.filter(kr => {
      return objectives.map(obj => obj.Id).includes(kr.parentObjective.Id);
    });

    setCurrentObjectives(objectives);
    setCurrentKeyResults(keyResults);
  }, [dateOption, props.freq, props.objectives, props.keyResults])

  return (
    <>
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
        objectives={currentObjectives}
        keyResults={currentKeyResults}
      />
    </>
  );
}