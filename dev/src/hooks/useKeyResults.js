import { useQuery } from "react-query";
import { constructUrl, constructReadQueryFn } from "../utils/query";
import { config } from "../config";

// Get all key results
export const useKeyResults = () => {
  const url = constructUrl(
    config.krListId,
    `Id,Title,krDescription,krStartDate,krEndDate,minValue,maxValue,currentValue,parentObjective/Id,parentObjective/team`,
    'parentObjective'
  );
  return useQuery(['keyResults'], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
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
  const url = constructUrl(
    config.krListId,
    `Id,Title,krDescription,krStartDate,krEndDate,minValue,maxValue,currentValue,parentObjective/Id,parentObjective/team`,
    'parentObjective',
    `parentObjective/team eq "${team}"`
  );
  return useQuery([`keyResults-${team}`], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
}