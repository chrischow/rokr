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