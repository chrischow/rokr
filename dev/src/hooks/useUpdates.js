import { useQuery } from "react-query";
import { constructUrl, constructReadQueryFn } from "../utils/query";
import { config } from "../config";

// Get all updates
export const useUpdates = () => {
  const url = constructUrl(
    config.updateListId,
    `Id,Title,updateText,updateDate,parentKrId`
  );
  return useQuery(['updates'], constructReadQueryFn(url), {
    staleTime: config.staleTime
  });
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
export const useKrUpdate = (krId) => {
  const allUpdates = useUpdates();
  return {
    data: allUpdates.isSuccess ? allUpdates.data.filter(update => {
      return update.parentKrId === Number(krId);
    }) : null,
    isSuccess: allUpdates.isSuccess
  };
}