// Config file
export const config = {
  apiUrl: 'http://127.0.0.1:5000/ravenpoint/_api/',
  objListId: '521d43a8e00c53c76ab48197784c5e41',
  krListId: 'f3ef36940ef93890c3f9d9e25fc12acc',
  updateListId: 'df7c2bf0cf2b0fda32b2998cbf8a07dc',
  objListItemEntityTypeFullName: 'SP.Data.RokrObjectivesListItem',
  krListItemEntityTypeFullName: 'SP.Data.RokrKeyResultsListItem',
  updateListItemEntityTypeFullName: 'SP.Data.RokrUpdatesListItem',
  teams: [
    { teamName: "HQ RAiD", slug: "hq-raid" },
    { teamName: "PAB", slug: "pab" },
    { teamName: "SWiFT", slug: "swift" },
    { teamName: "RDO", slug: "rdo" },
    { teamName: "CyDef", slug: "cydef" },
    { teamName: "SES", slug: "ses" },
  ],
  staleTime: 2 * 60 * 1000,
  tokenRefreshTime: 10 * 60 * 1000
};