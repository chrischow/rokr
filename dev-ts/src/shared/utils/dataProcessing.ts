import { Objective, KeyResult } from '../types';

// Sort by Title
export const sortByTitle = (
  a: Pick<Objective | KeyResult, 'Title'>,
  b: Pick<Objective | KeyResult, 'Title'>
) => {
  if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
    return -1;
  }
  if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
    return 1;
  }
  return 0;
};