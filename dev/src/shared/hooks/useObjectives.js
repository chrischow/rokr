import { useQuery } from "react-query";
import slugify from "slugify";
import { objectives } from '../data/objectives';
import { config } from "../../config";

// Get all objectives
export const useObjectives = () => {
  return useQuery(
    ['objectives'],
    async () => objectives.data,
    {
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
  return useQuery(
    ['objectives', 'freq', freq],
    async () => (objectives.data.filter(obj => obj.frequency === freq)),
    {
      staleTime: config.staleTime
    }
  );
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
  return useQuery(
    ['objectives', 'team', team],
    async () => (objectives.data.filter(obj => obj.team === team)),
    {
      staleTime: config.staleTime
    }
  );
}