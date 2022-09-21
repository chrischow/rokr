import { TeamInfo, Objective, KeyResult } from '../types';
import {
  offsetDate,
  getYear,
  getWorkYear,
  getQuarter,
  getMonth
} from './dates';

// Compute KR completion
export function computeKrCompletion(data: KeyResult[]) {
  var krCompleted = data
    .map(entry => entry.currentValue === entry.maxValue ? 1 : 0)
    .reduce((prev: number, next: number) => prev + next, 0);

  return {
    completed: krCompleted,
    total: data.length,
  };
}

// Compute KR percentages
export function computeKrPercentage(data: KeyResult[]) {
  var total = 0.0;
  for (var i = 0; i < data.length; i++) {
    total += data[i].currentValue / data[i].maxValue;
  }
  return total / data.length;
}

// Compute Objective completion
export function computeObjCompletion(
  objectives: Objective[],
  keyResults: KeyResult[]
) {
  var total = objectives.length;
  var completed = 0;
  var filteredKRs;
  var completedKRs;
  var numKRs;
  var pctCompletion;
  var avgCompletion = 0;
  for (var i = 0; i < objectives.length; i++) {
    // Filter KRs for each objective and compute completion
    filteredKRs = keyResults.filter(kr => kr.parentObjective.Id === objectives[i].Id);
    numKRs = filteredKRs.length;
    if (numKRs === 0) { continue; }

    // Compute average completion
    pctCompletion = filteredKRs.map(kr => {
      return kr.currentValue / kr.maxValue;
    });
    avgCompletion +=
      pctCompletion.reduce((a, b) => a + b, 0) / numKRs;
    completedKRs = filteredKRs.filter(kr => kr.currentValue === kr.maxValue);

    if (numKRs === completedKRs.length && numKRs > 0) {
      completed++;
    }
  }

  avgCompletion /= total;

  return { completed, total, avgCompletion };
}

// Compute overall metrics for a given frequency
export function computeMetrics(
  objectives: Objective[],
  keyResults: KeyResult[],
  frequency: string
) {
  const tempObjectives = objectives.filter(obj => obj.frequency === frequency);

  const tempKRs = keyResults.filter(kr => {
    // const objs = tempObjectives.filter(obj => obj.Id === kr.parentObjective.Id);
    // return objs.length > 0;
    return tempObjectives.map(obj => obj.Id).includes(kr.parentObjective.Id);
  });

  const tempObjCompletion = computeObjCompletion(tempObjectives, tempKRs);
  const output = {
    avgCompletion: tempObjCompletion.avgCompletion
      ? tempObjCompletion.avgCompletion
      : 0,
    keyResultCompletion: computeKrCompletion(tempKRs),
    objectiveCompletion: {
      completed: tempObjCompletion.completed,
      total: tempObjCompletion.total,
    },
  };

  return output;
}

// Compute overall metrics for a given set of teams, at a given frequency
export function computeTeamsMetrics(
  teams: TeamInfo[],
  objectives: Objective[],
  keyResults: KeyResult[],
  frequency: string
) {
  var output: any = {};
  var tempObj, tempKR;
  for (var i = 0; i < teams.length; i++) {
    // Filter objectives
    tempObj = objectives.filter(entry => entry.team === teams[i].teamName);
    // Filter KRs
    tempKR = keyResults.filter(entry => entry.parentObjective.team === teams[i].teamName);
    output[teams[i].teamName] = computeMetrics(tempObj, tempKR, frequency);
  }
  return output;
}

// Sort strings in alphabetical order
export function sortStringArray(a: any, b: any): number {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
}

// Get staff
export function getStaffFromObjectives(objectives: Objective[]) {
  var staffList = objectives.map(item => {
    if (item.frequency === "monthly") {
      return item.owner;
    }
  });
  staffList = Array.from(new Set(staffList));

  staffList = staffList.filter(item => {
    return item != null;
  });

  staffList.sort(sortStringArray);
  return staffList;
}

// Get entries for annual, quarterly, and monthly
interface SubGroups {
  annual: string[];
  quarterly: string[];
  monthly: string[];
}

export function getSubGroupsFromObjectives(objectives: Objective[]) {
  var output: SubGroups = {
    annual: [],
    quarterly: [],
    monthly: [],
  };

  var date, year, workyear, quarter, month;
  objectives.forEach((item) => {
    date = offsetDate(item.objectiveEndDate);
    year = getYear(date);
    workyear = getWorkYear(date);
    quarter = getQuarter(date, workyear);
    month = getMonth(date, year);

    if (item.frequency === "annual") {
      if (!output.annual.includes(workyear)) {
        output.annual.push(workyear);
      }
    } else if (item.frequency === "quarterly") {
      if (!output.quarterly.includes(quarter)) {
        output.quarterly.push(quarter);
      }
    } else {
      if (!output.monthly.includes(month)) {
        output.monthly.push(month);
      }
    }
  });

  // Sort
  output.annual.sort().reverse();
  output.quarterly.sort().reverse();
  output.monthly.sort().reverse();

  return output;
}