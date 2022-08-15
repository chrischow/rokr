import { offsetDate, getYear, getWorkYear, getQuarter, getMonth } from './dates';

// Compute KR completion
export function computeKrCompletion(data) {
  var krCompleted = data
    .map(entry => {
      var pct = entry.currentValue / entry.maxValue;
      return pct === 1.0 ? 1 : 0;
    })
    .reduce((prev, next) => prev + next, 0);

  return {
    completed: krCompleted,
    total: data.length,
  };
}

// Compute KR percentages
export function computeKrPercentage(data) {
  var count = 0;
  var total = 0.0;
  for (var i = 0; i < data.length; i++) {
    total += data[i].currentValue / data[i].maxValue;
    count += 1;
  }
  return total / count;
}

// Compute Objective completion
export function computeObjCompletion(objectives, keyResults) {
  var total = objectives.length;
  var completed = 0;
  var filteredKRs;
  var completedKRs;
  var numKRs;
  var pctCompletion;
  var avgCompletion = 0;
  for (var i = 0; i < objectives.length; i++) {
    // Filter KRs for each objective
    filteredKRs = keyResults.filter(kr => {
      return kr.parentObjectiveId === objectives[i].objectiveId;
    });
    numKRs = filteredKRs.length;

    // Compute average completion
    pctCompletion = filteredKRs.map(kr => {
      return kr.currentValue / kr.maxValue;
    });
    avgCompletion +=
      pctCompletion.reduce((a, b) => {
        return a + b;
      }, 0) / numKRs;
    completedKRs = filteredKRs.filter(kr => {
      return kr.currentValue === kr.maxValue;
    });

    if (numKRs === completedKRs.length) {
      if (numKRs > 0) {
        completed++;
      }
    }
  }

  avgCompletion /= total;

  return { completed, total, avgCompletion };
}

// Compute overall metrics for a given frequency
export function computeMetrics(objectives, keyResults, frequency) {
  const tempObjectives = objectives.filter(obj => {
    return obj.frequency === frequency;
  });

  const tempKRs = keyResults.filter(kr => {
    const objs = tempObjectives.filter(obj => {
      return obj.objectiveId === kr.parentObjectiveId;
    });
    return objs.length > 0;
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
export function computeTeamsMetrics(teams, objectives, keyResults, frequency) {
  var output = {};
  var tempObj, tempKR;
  for (var i = 0; i < teams.length; i++) {
    // Filter objectives
    tempObj = objectives.filter(entry => {
      return entry.team === teams[i].teamName;
    });
    // Filter KRs
    tempKR = keyResults.filter(entry => {
      return entry.parentObjectiveTeam === teams[i].teamName;
    });

    output[teams[i].teamName] = computeMetrics(tempObj, tempKR, frequency);
  }
  return output;
}

// Prepare team data in nested format
export function prepareTeamData(objectives, keyResults) {
  var output = {};
  var freqs = ["annual", "quarterly", "monthly"];
  var tempObj;
  var parentObj;
  var tempKR;
  var tempObjCompletion;
  var staffList;
  for (var f = 0; f < freqs.length; f++) {
    tempObj = objectives.filter(entry => {
      return entry.frequency === freqs[f];
    });

    tempKR = keyResults.filter(entry => {
      parentObj = objectives.filter(obj => obj.objectiveId === entry.parentObjectiveId)[0];
      return parentObj.frequency === freqs[f];
    });

    tempObjCompletion = computeObjCompletion(tempObj, tempKR);

    output[freqs[f]] = {
      avgCompletion: tempObjCompletion.avgCompletion
        ? tempObjCompletion.avgCompletion
        : 0,
      keyResultCompletion: computeKrCompletion(tempKR),
      objectiveCompletion: {
        completed: tempObjCompletion.completed,
        total: tempObjCompletion.total,
      },
      objectives: tempObj,
      keyResults: tempKR,
    };

    if (freqs[f] === "monthly") {
      staffList = tempObj.map(item => item.owner);
      staffList = [...new Set(staffList)];
      staffList = staffList.filter(item => item !== null);
    }
  }

  // For each staff, also calculate obj completion and kr completion
  var staff;
  for (var i = 0; i < staffList.length; i++) {
    staff = staffList[i];
    tempObj = objectives.filter(entry => {
      return entry.owner === staff;
    });

    tempKR = keyResults.filter(entry => {
      parentObj = objectives.filter(obj => obj.objectiveId === entry.parentObjectiveId)[0];
      return parentObj.owner === staff;
    });

    tempObjCompletion = computeObjCompletion(tempObj, tempKR);

    output[staff] = {
      avgCompletion: tempObjCompletion.avgCompletion
        ? tempObjCompletion.avgCompletion
        : 0,
      keyResultCompletion: computeKrCompletion(tempKR),
      objectiveCompletion: {
        completed: tempObjCompletion.completed,
        total: tempObjCompletion.total,
      },
      objectives: tempObj,
      keyResults: tempKR,
    };
  }

  return output;
}

// Prepare display data
export function prepareTeamPageData(objectives, keyResults, frequency, staff, subGroup) {
  const tempObj = objectives.filter(item => {
    const date = offsetDate(item.objectiveEndDate);
    const year = getYear(date);
    const workyear = getWorkYear(date);
    const currentSubGroup = frequency === 'annual'
      ? workyear
      : frequency === 'quarterly'
        ? getQuarter(date, workyear)
        : getMonth(date, year);

    var condition = true;
    condition = condition && item.frequency === frequency;
    if (frequency === 'monthly' && staff) {
      condition = condition && item.owner === staff;
    }
    condition = condition && currentSubGroup === subGroup;

    return condition;
  });

  const tempKR = keyResults.filter(kr => {
    const objs = tempObj.filter(obj => {
      return obj.objectiveId === kr.parentObjectiveId;
    });
    return objs.length > 0;
  });

  const tempObjCompletion = computeObjCompletion(tempObj, tempKR);
  const output = {
    avgCompletion: tempObjCompletion.avgCompletion
      ? tempObjCompletion.avgCompletion
      : 0,
    keyResultCompletion: computeKrCompletion(tempKR),
    objectiveCompletion: {
      completed: tempObjCompletion.completed,
      total: tempObjCompletion.total,
    },
    objectives: tempObj,
    keyResults: tempKR,
  };

  return output;
}

// Sort strings in alphabetical order
export function sortStringArray(a, b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
}

// Sort Objectives by frequency, then by title
export function sortObjectivesFreqTitle(a, b) {
  const aFreq = a.frequency === "annual" ? 3 : (
    a.frequency === "quarterly" ? 2 : 1
  );

  const bFreq = b.frequency === "annual" ? 3 : (
    b.frequency === "quarterly" ? 2 : 1
  );
  
  // if (aFreq > bFreq) {
  //   return -1;
  // } else if (aFreq < bFreq) {
  //   return 1;
  // } else {
  //   if (a.objectiveTitle > b.objectiveTitle) {
  //     return 1;
  //   } else if (a.objectiveTitle < b.objectiveTitle) {
  //     return -1;
  //   } else {
  //     return 0;
  //   }
  // }
  return aFreq > bFreq
    ? -1
    : aFreq < bFreq
      ? 1
      : a.objectiveTitle > b.objectiveTitle
        ? 1
        : a.objectiveTitle < b.objectiveTitle
          ? -1
          : 0;
}

// Get staff
export function getStaffFromObjectives(objectives) {
  var staffList = objectives.map(item => {
    if (item.frequency === "monthly") {
      return item.owner;
    }
  });
  staffList = [...new Set(staffList)];

  staffList = staffList.filter(item => {
    return item != null;
  });

  staffList.sort(sortStringArray);
  return staffList;
}

// Get entries for annual, quarterly, and monthly
export function getSubGroupsFromObjectives(objectives) {
  var output = {
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