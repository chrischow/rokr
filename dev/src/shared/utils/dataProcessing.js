// Sort by Title
export const sortByTitle = (a,b) => {
  if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
    return -1;
  }
  if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
    return 1;
  }
  return 0;
};