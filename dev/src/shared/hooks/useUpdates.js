import { useQuery } from "react-query";
import { updates } from '../data/updates';
import { config } from "../../config";

// Get all updates
export const useUpdates = () => {
  return useQuery(
    ['updates'],
    async () => updates.data,
    {
      staleTime: config.staleTime
    }
  );
};

// Get single update by ID
export const useUpdate = (Id) => {
  const allUpdates = useUpdates();
  return {
    data: allUpdates.isSuccess ? allUpdates.data.find(update => {
      return update.Id === Number(Id);
    }) : null,
    isSuccess: allUpdates.isSuccess
  };
}

// Get update by key result ID
export const useKrUpdates = (krId) => {
  const allUpdates = useUpdates();
  return {
    data: allUpdates.isSuccess ? allUpdates.data.filter(update => {
      return update.parentKrId === Number(krId);
    }) : null,
    isSuccess: allUpdates.isSuccess
  };
}

// Get update by key result ID
export const useKrUpdatesDirect = (krId) => {
  return useQuery(
    ['updates', krId],
    async () => updates.data.filter(update => update.parentKrId === Number(krId)),
    {
      staleTime: config.staleTime
    });
}

// Get all updates for only a given team
export const useTeamUpdates = (team) => {
  return useQuery(
    ['updates', team],
    async () => updates.data.filter(update => update.team === team),
    {
      staleTime: config.staleTime
    });
};