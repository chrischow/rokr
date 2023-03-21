// Config file
export const config = {
  apiUrl: 'http://127.0.0.1:5000/ravenpoint/_api/',
  feedbackUrl: 'http://127.0.0.1:5000/ravenpoint/_api/',
  objListTitle: 'ROKRObjectives',
  krListTitle: 'ROKRKeyResults',
  updateListTitle: 'ROKRUpdates',
  feedbackListTitle: 'StackFeedback',
  surveyListTitle: 'StackUserSatisfaction',
  objListItemEntityTypeFullName: 'SP.Data.ROKRObjectivesListItem',
  krListItemEntityTypeFullName: 'SP.Data.ROKRKeyResultsListItem',
  updateListItemEntityTypeFullName: 'SP.Data.ROKRUpdatesListItem',
  feedbackListItemEntityTypeFullName: 'SP.Data.StackFeedbackListItem',
  surveyListItemEntityTypeFullName: 'SP.Data.StackUserSatisfactionListItem',
  teams: [
    { teamName: "PIXEL HQ", slug: "pixel" },
    { teamName: "Objective 1", slug: "obj1" },
    { teamName: "Objective 2", slug: "obj2" },
    { teamName: "Objective 3", slug: "obj3" },
    { teamName: "Objective 4", slug: "obj4" },
    { teamName: "Objective 5", slug: "obj5" },
    { teamName: "Miscellanous", slug: "miscel" },
  ],
  // staleTime: 2 * 60 * 1000,
  staleTime: Infinity,
  tokenRefreshTime: 25 * 60 * 1000
};


// teams: [
//   { teamName: "RAiD", slug: "raid" },
//   { teamName: "PAB", slug: "pab" },
//   { teamName: "SWiFT", slug: "swift" },
//   { teamName: "RDO", slug: "rdo" },
//   { teamName: "CyDef", slug: "cydef" },
//   { teamName: "SES-HM", slug: "ses-hm" },
//   { teamName: "SES-Rock", slug: "ses-rock" },
//   { teamName: "SES-KK", slug: "ses-kk" },
//   { teamName: "SES-Oli", slug: "ses-oli" },
// ],