export type WeakAreaId =
  | "cloud-concepts"
  | "azure-architecture"
  | "azure-management"
  | "azure-security"
  | "cost-management";

export interface StudyUnit {
  area: string;
  subtopic: string;
  tip: string;
}

export interface StudySprint {
  day: number;
  date: string;
  items: StudyUnit[];
  isReview: boolean;
}

export interface PlanConfig {
  examDate: string;
  dailyHours: number;
  weakAreas: WeakAreaId[];
}
