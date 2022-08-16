import { useState } from "react";
import { computeMetrics } from "../../../utils/stats";
import { getMonth, getQuarter, getWorkYear, getYear } from "../../../utils/dates";
import FreqDropdown from "../FreqDropdown/FreqDropdown";
import TeamProgress from "../TeamProgress/TeamProgress";

export default function TeamPane(props) {
  // Compute default option
  const today = new Date();
  const year = getYear(today);
  const workyear = getWorkYear(today);
  const initialFreq = props.freq === 'annual'
    ? workyear
    : props.freq === 'quarterly'
      ? getQuarter(today, workyear)
      : getMonth(today, year);

  // Dropdown option
  const [dateOption, setDateOption] = useState(initialFreq);

  return (
    <>
      <FreqDropdown freq={props.freq} options={props.subgroups} dateOption={dateOption} setDateOption={setDateOption} />
      <TeamProgress
        freq={props.freq}
        data={computeMetrics(props.objectives, props.keyResults, props.freq)}
      />
    </>
  );
}