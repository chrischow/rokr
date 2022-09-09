import { useQuery } from "react-query";
import { constructUrl, constructReadQueryFn } from "../../utils/query";
import slugify from "slugify";
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
export const useObjective = (Id) => {
  const allObjectives = useObjectives();
  return {
    data: allObjectives.isSuccess ? allObjectives.data.find(objective => {
      return objective.Id === Number(Id);
    }) : null,
    isSuccess: allObjectives.isSuccess
  };
}

// Get objective by frequency
export const useObjectivesByFreq = (freq) => {
  const url = constructUrl(
    config.objListId,
    `Id,Title,objectiveDescription,objectiveStartDate,objectiveEndDate,team,owner,frequency`,
    undefined,
    `frequency eq '${freq}'`
  );

  return useQuery(['objectives', freq], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
}

// Get objectives by team, using entries from full dataset
export const useTeamObjectivesCache = (team) => {
  const allObjectives = useObjectives();
  return {
    data: allObjectives.isSuccess ? allObjectives.data.filter(objective => {
      return objective.team === team;
    }) : null,
    isSuccess: allObjectives.isSuccess
  };
};

// Get objectives for team
export const useTeamObjectives = (team) => {
  const url = constructUrl(
    config.objListId,
    `Id,Title,objectiveDescription,objectiveStartDate,objectiveEndDate,team,owner,frequency`,
    undefined,
    `team eq '${team}'`
  );

  return useQuery([`objectives-${slugify(team)}`], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
}