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
  const krCompleted = data
    .map(entry => entry.currentValue === entry.maxValue ? 1 : 0)
    .reduce((prev: number, next: number) => prev + next, 0);

  return {
    completed: krCompleted,
    total: data.length,
  };
}

// Compute KR percentages
export function computeKrPercentage(data: KeyResult[]) {
  let total = 0.0;
  data.forEach(kr => {
    total += kr.currentValue / kr.maxValue;
  })
  return total / data.length;
}

// Compute Objective completion
export function computeObjCompletion(
  objectives: Objective[],
  keyResults: KeyResult[]
) {
  const total = objectives.length;
  let completed = 0;
  let filteredKRs;
  let completedKRs;
  let numKRs;
  let pctCompletion;
  let avgCompletion = 0;
  objectives.forEach(obj => {
    // Filter KRs for each objective and compute completion
    filteredKRs = keyResults.filter(kr => kr.parentObjective.Id === obj.Id);
    numKRs = filteredKRs.length;
    if (numKRs > 0) {
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
  });

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
  const output: any = {};
  let tempObj, tempKR;
  teams.forEach(team => {
    // Filter objectives
    tempObj = objectives.filter(entry => entry.team === team.teamName);
    // Filter KRs
    tempKR = keyResults.filter(entry => entry.parentObjective.team === team.teamName);
    output[team.teamName] = computeMetrics(tempObj, tempKR, frequency);
  });
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
  let staffList: any = objectives.forEach(item => {
    if (item.frequency === "monthly") {
      return item.owner;
    }
  });
  staffList = Array.from(new Set(staffList));

  staffList = staffList.filter((item: string) => {
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
  const output: SubGroups = {
    annual: [],
    quarterly: [],
    monthly: [],
  };

  let date, year, workyear, quarter, month;
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
  output.annual.sort()
  output.annual.reverse();
  output.quarterly.sort()
  output.quarterly.reverse();
  output.monthly.sort()
  output.monthly.reverse();

  return output;
}