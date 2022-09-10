import { useQuery } from "react-query";
import slugify from "slugify";
import { objectives } from '../data/objectives';
import { keyResults } from '../data/keyResults';
import { config } from "../../config";

// Combine data
const allKrs = keyResults.data.map(kr => {
  // Get associated objective
  const parentObjective = objectives.data.find(obj => obj.Id === kr.parentObjective);
  return {
    ...kr,
    parentObjective: {
      Id: parentObjective.Id,
      team: parentObjective.team,
      frequency: parentObjective.frequency
    }
  }
});

// Get all key results
export const useKeyResults = () => {
  return useQuery(
    ['keyResults'],
    async () => allKrs,
    {
      staleTime: config.staleTime
    }
  );
};

// Get single key result by ID
export const useKeyResult = (Id) => {
  const allKeyResults = useKeyResults();
  return {
    data: allKeyResults.isSuccess ? allKeyResults.data.find(keyResult => {
      return keyResult.Id === Number(Id);
    }) : null,
    isSuccess: allKeyResults.isSuccess
  };
}

// Get key results by objective frequency
export const useKeyResultsByFreq = (freq) => {
  return useQuery(
    ['keyResults', freq],
    async () => allKrs.filter(kr => kr.parentObjective.frequency === freq),
    {
      staleTime: config.staleTime
    }
  );
};

// Get key results by team, using entries from full dataset
export const useTeamKeyResultsCache = (team) => {
  const allKeyResults = useKeyResults();
  return {
    data: allKeyResults.isSuccess ? allKeyResults.data.filter(keyResult => {
      return keyResult.parentObjective.team === team;
    }) : null,
    isSuccess: allKeyResults.isSuccess
  };
};

// Get key results by team
export const useTeamKeyResults = (team) => {
  return useQuery(
    [`keyResults-${slugify(team)}`],
    async () => {
      console.log(allKrs.filter(kr => kr.parentObjective.team === team));
      return allKrs.filter(kr => kr.parentObjective.team === team)
    },
    {
      staleTime: config.staleTime
    }
  );
}