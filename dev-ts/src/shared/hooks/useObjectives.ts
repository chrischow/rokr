import { useQuery } from "react-query";
import { constructUrl, constructReadQueryFn } from "../../shared/utils/query";
import { Objective } from "../types";
import { config } from "../../config";

// Get all objectives
export const useObjectives = () => {
  const url = constructUrl(
    config.objListId,
    `Id,Title,objectiveDescription,objectiveStartDate,objectiveEndDate,team,owner,frequency`
  );

  return useQuery(['objectives'], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
};

// Get single objective by ID
export const useObjective = (Id: number) => {
  const allObjectives = useObjectives();
  return {
    data: allObjectives.isSuccess ? allObjectives.data.find((objective: Objective) => {
      return objective.Id === Number(Id);
    }) : null,
    isSuccess: allObjectives.isSuccess
  };
}

// Get objective by frequency
export const useObjectivesByFreq = (freq: string) => {
  const url = constructUrl(
    config.objListId,
    `Id,Title,objectiveDescription,objectiveStartDate,objectiveEndDate,team,owner,frequency`,
    undefined,
    `frequency eq '${freq}'`
  );

  return useQuery(['objectives', 'freq', freq], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
}

// Get objectives by team, using entries from full dataset
export const useTeamObjectivesCache = (team: string) => {
  const allObjectives = useObjectives();
  return {
    data: allObjectives.isSuccess ? allObjectives.data.filter((objective: Objective) => {
      return objective.team === team;
    }) : null,
    isSuccess: allObjectives.isSuccess
  };
};

// Get objectives for team
export const useTeamObjectives = (team: string) => {
  const url = constructUrl(
    config.objListId,
    `Id,Title,objectiveDescription,objectiveStartDate,objectiveEndDate,team,owner,frequency`,
    undefined,
    `team eq '${team}'`
  );

  return useQuery(['objectives', 'team', team], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
}