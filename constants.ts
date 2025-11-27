import { Dimension, Statement } from './types';

export const ASSESSMENT_STATEMENTS: Statement[] = [
  // --- Charisma: Unlocked (Presence, Power, Warmth) ---
  {
    id: 1,
    text: "I utilize a '60-second centering' practice to ground myself physically and mentally before entering high-pressure environments.",
    dimension: Dimension.Presence
  },
  {
    id: 2,
    text: "I maintain active presence and direct eye contact (including with the camera lens) to signal engagement in virtual settings.",
    dimension: Dimension.Presence
  },
  {
    id: 3,
    text: "I employ strategic silence (pausing) during negotiations to signal confidence rather than filling the void with speech.",
    dimension: Dimension.Power
  },
  {
    id: 4,
    text: "I validate intent and seek to understand the thought process behind a mistake before offering correction.",
    dimension: Dimension.Warmth
  },
  
  // --- Resilience & Strategic Decision-Making ---
  {
    id: 5,
    text: "I use a 'Sensing-Sizing-Responding' framework to iterate decisions as new data emerges in ambiguous situations.",
    dimension: Dimension.DecisionMaking
  },
  {
    id: 6,
    text: "I conduct 'Pre-Mortems' (imagining failure backward) to identify potential risks before launching major initiatives.",
    dimension: Dimension.DecisionMaking
  },
  {
    id: 7,
    text: "I recognize my specific emotional triggers ('Dark Side' traits) and initiate a recovery protocol when under extreme pressure.",
    dimension: Dimension.Resilience
  },
  {
    id: 8,
    text: "I actively audit my cognitive energy and schedule non-negotiable recovery blocks to prevent decision fatigue.",
    dimension: Dimension.Resilience
  }
];

export const SYSTEM_PROMPT = `
You are a strategic leadership consultant drafting a "Personal Action Plan" for a senior leader.
This is NOT a feedback report. It is a rigorous, forward-looking development plan document.

INPUT DATA:
1. Assessment Scores (Traffic Light system based on specific course behaviors).
2. User's Self-Reflected Strengths and Limitations.

YOUR TASK:
Draft a "Personal Action Plan" that bridges the gap between the user's self-perception and their assessment results.
The tone must be:
- Intellectually challenging: Question assumptions.
- High-level: Appropriate for senior executives.
- Specific: Reference the course concepts (Centering, Pre-Mortem, Sensing-Sizing, Strategic Silence).

STRUCTURE Requirements:
1. synthesis: concisely synthesize their verified strengths (High scores) and the critical priorities (Low scores + self-admitted limitations).
2. developmentPlan: Pick ONE high-impact area to focus on.
   - reasonForChoosing: Why this lever moves the biggest rock.
   - goalSMART: A specific, measurable outcome.
   - benefits: The ROI of this change.
   - risks/obstacles/mitigation: Real-world friction points.
3. actionSteps: Provide 3 distinct steps categorised by:
   - Experience (Doing the work)
   - Exposure (Shadowing/Feedback)
   - Education (Formal learning/Reviewing materials)

Format output as JSON. Avoid "Cheerleading". Be clinical and precise.
`;
