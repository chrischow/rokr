export interface TeamInfo {
  teamName: string;
  slug: string;
}

export interface Objective {
  Id: number;
  Title: string;
  frequency: string;
  objectiveDescription: string;
  objectiveStartDate: string;
  objectiveEndDate: string;
  owner: string;
  team: string;
}

export interface ParentObjective {
  Id: number;
  team: string;
  frequency: string;
}

export interface KeyResult {
  Id: number;
  Title: string;
  krDescription: string;
  krStartDate: string;
  krEndDate: string;
  minValue: number;
  currentValue: number;
  maxValue: number;
  parentObjective:  ParentObjective;
}

export interface Update {
  Id: number;
  updateText: string;
  updateDate: string;
  parentKrId: number;
  team: string;
}

export interface Feedback {
  Title: string;
  feedback: string;
  app: string;
}

// Forms
export interface ObjectiveFormValues extends Omit<Objective, "Id"> {
  Id?: number;
}

export interface KeyResultFormValues extends Omit<KeyResult, "Id" | "parentObjective"> {
  Id?: number;
  parentObjective: number;
}

export interface UpdateFormValues extends Omit<Update, "Id"> {
  Id?: number;
}

export interface ObjectiveOptions {
  value: number;
  label: string;
}

interface Metadata {
  type: string
}

export interface PostObjective extends Omit<Objective, "Id"> {
  '__metadata': Metadata
}

export interface PostKeyResult extends Omit<KeyResult, "Id"|"parentObjective"> {
  '__metadata': Metadata,
  parentObjectiveId?: number;
}

export interface PostUpdate extends Omit<Update, "Id"> {
  '__metadata': Metadata
}

export interface PostFeedback extends Feedback {
  '__metadata': Metadata
}

export interface PostSurvey extends ISurveyForm {
  '__metadata': Metadata
}

// For progress cards - Home and Team pages
export interface ProgressCompletion {
  completed: number;
  total: number;
}

export interface ProgressCardData {
  avgCompletion: number;
  keyResultCompletion: ProgressCompletion;
  objectiveCompletion: ProgressCompletion;
}

// Survey form
export interface ISurveyForm {
  app: string;
  Title: string;
  lookAndFeel: number;
  easeOfUse: number;
  meetNeeds: number;
  likeMost: string;
  likeLeast: string;
  suggestions: string;
  overall: number;
}

export interface IHoverState {
  lookAndFeel: number;
  easeOfUse: number;
  meetNeeds: number;
  overall: number;
}