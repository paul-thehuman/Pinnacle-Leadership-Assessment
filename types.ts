export enum Dimension {
  Presence = "Presence & Impact",
  Power = "Power & Influence",
  Warmth = "Connection & Warmth",
  Resilience = "Resilience & Energy",
  DecisionMaking = "Strategic Decision Making"
}

export type TrafficLight = 'red' | 'amber' | 'green' | null;

export interface Statement {
  id: number;
  text: string; // The ideal behavior from the course
  dimension: Dimension;
}

export interface UserReflections {
  strengths: string;
  limitations: string;
}

export interface ActionStep {
  approach: "Experience" | "Exposure" | "Education";
  action: string;
  targetDate: string;
}

// Mirrors the "Personal Action Plan" from the PDF
export interface ActionPlanReport {
  synthesis: {
    keyStrengths: string; // Combined AI analysis + User input
    keyPriorities: string; // Combined AI analysis + User input
  };
  developmentPlan: {
    focusArea: string;
    reasonForChoosing: string;
    goalSMART: string;
    benefits: string;
    risks: string;
    obstacles: string;
    mitigation: string;
  };
  actionSteps: ActionStep[];
}
