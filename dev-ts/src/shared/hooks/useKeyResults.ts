import { useQuery } from "react-query";
import { constructUrl, constructReadQueryFn } from "../../shared/utils/query";
import { KeyResult } from '../types';
import { config } from "../../config";

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
export const useKeyResult = (Id: number) => {
  const allKeyResults = useKeyResults();
  return {
    data: allKeyResults.isSuccess ? allKeyResults.data.find((keyResult: KeyResult) => {
      return keyResult.Id === Number(Id);
    }) : null,
    isSuccess: allKeyResults.isSuccess
  };
}

// Get key results by objective frequency
export const useKeyResultsByFreq = (freq: string) => {
  const url = constructUrl(
    config.krListId,
    `Id,Title,krDescription,krStartDate,krEndDate,minValue,maxValue,currentValue,parentObjective/Id,parentObjective/team,parentObjective/frequency`,
    'parentObjective',
    `parentObjective/frequency eq '${freq}'`
  );
  return useQuery(['keyResults', 'freq', freq], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
};

// Get key results by team, using entries from full dataset
export const useTeamKeyResultsCache = (team: string) => {
  const allKeyResults = useKeyResults();
  return {
    data: allKeyResults.isSuccess ? allKeyResults.data.filter((keyResult: KeyResult) => {
      return keyResult.parentObjective.team === team;
    }) : null,
    isSuccess: allKeyResults.isSuccess
  };
};

// Get key results by team
export const useTeamKeyResults = (team: string) => {
  const url = constructUrl(
    config.krListId,
    `Id,Title,krDescription,krStartDate,krEndDate,minValue,maxValue,currentValue,parentObjective/Id,parentObjective/team`,
    'parentObjective',
    `parentObjective/team eq '${team}'`
  );
  return useQuery(['keyResults', 'team', team], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
}