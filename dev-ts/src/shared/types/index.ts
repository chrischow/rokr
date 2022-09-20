export interface Team {
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

interface Metadata {
  type: string
}

export interface PostObjective extends Omit<Objective, "Id"> {
  '__metadata': Metadata
}

export interface PostKeyResult extends Omit<KeyResult, "Id"> {
  '__metadata': Metadata
}

export interface PostUpdate extends Omit<Update, "Id"> {
  '__metadata': Metadata
}