// Config file
export const config = {
  apiUrl: 'http://127.0.0.1:5000/ravenpoint/_api/',
  feedbackUrl: 'http://127.0.0.1:5000/ravenpoint/_api/',
  objListTitle: 'ROKRObjectives',
  krListTitle: 'ROKRKeyResults',
  updateListTitle: 'ROKRUpdates',
  feedbackListTitle: 'StackFeedback',
  surveyListTitle: 'StackUserSatisfaction',
  objListItemEntityTypeFullName: 'SP.Data.RokrObjectivesListItem',
  krListItemEntityTypeFullName: 'SP.Data.RokrKeyResultsListItem',
  updateListItemEntityTypeFullName: 'SP.Data.RokrUpdatesListItem',
  feedbackListItemEntityTypeFullName: 'SP.Data.StackFeedbackListItem',
  surveyListItemEntityTypeFullName: 'SP.Data.StackUserSatisfactionListItem',
  teams: [
    { teamName: "PIXEL HQ", slug: "pixel" },
    { teamName: "Tech and Science", slug: "tech" },
    { teamName: "Experiments", slug: "expr" },
    { teamName: "HPM", slug: "hpm" },
    { teamName: "Data", slug: "data" },
    { teamName: "Contracting and Finance", slug: "finance" },
  ],
  // staleTime: 2 * 60 * 1000,
  staleTime: Infinity,
  tokenRefreshTime: 25 * 60 * 1000
};

