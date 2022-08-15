import { useQuery } from "react-query";
import { constructUrl, constructReadQueryFn } from "../utils/query";
import { config } from "../config";

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

// Get objectives by team
export const useTeamObjectives = (team) => {
  const allObjectives = useObjectives();
  return {
    data: allObjectives.isSuccess ? allObjectives.data.filter(objective => {
      return objective.team === team;
    }) : null,
    isSuccess: allObjectives.isSuccess
  };
};