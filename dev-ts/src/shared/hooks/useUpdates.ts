import { useQuery } from "react-query";
import { constructUrl, constructReadQueryFn } from "../../shared/utils/query";
import { Update } from '../types';
import { config } from "../../config";

// Get all updates
export const useUpdates = () => {
  const url = constructUrl(
    config.updateListId,
    `Id,updateText,updateDate,parentKrId,team`
  );
  return useQuery(['updates'], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
};

// Get single update by ID
export const useUpdate = (Id: number) => {
  const allUpdates = useUpdates();
  return {
    data: allUpdates.isSuccess ? allUpdates.data.find((update: Update) => {
      return update.Id === Number(Id);
    }) : null,
    isSuccess: allUpdates.isSuccess
  };
}

// Get update by key result ID
export const useKrUpdates = (krId: number) => {
  const allUpdates = useUpdates();
  return {
    data: allUpdates.isSuccess ? allUpdates.data.filter((update: Update) => {
      return update.parentKrId === Number(krId);
    }) : null,
    isSuccess: allUpdates.isSuccess
  };
}

// Get update by key result ID
export const useKrUpdatesDirect = (krId: number) => {
  const url = constructUrl(
    config.updateListId,
    `Id,updateText,updateDate,parentKrId,team`,
    undefined,
    `parentKrId eq ${krId}`
  );
  return useQuery(['updates', 'kr', Number(krId)], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
}

// Get updates by team
// export const useTeamUpdates = (team) => {
//   const allUpdates = useUpdates();
//   return {
//     data: allUpdates.isSuccess ? allUpdates.data.filter(update => {
//       return update.team === team;
//     }) : null,
//     isSuccess: allUpdates.isSuccess
//   }
// }

// Get all updates for only a given team
export const useTeamUpdates = (team: string) => {
  const url = constructUrl(
    config.updateListId,
    `Id,updateText,updateDate,parentKrId,team`,
    undefined,
    `team eq '${team}'`
  );
  return useQuery(['updates', 'team', team], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
};