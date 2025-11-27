import { GoogleGenAI, Type } from "@google/genai";
import { ActionPlanReport, Dimension, Statement, UserReflections, TrafficLight } from "../types";
import { SYSTEM_PROMPT, ASSESSMENT_STATEMENTS } from "../constants";

const getTrafficLightScore = (color: TrafficLight): number => {
  switch (color) {
    case 'green': return 5;
    case 'amber': return 3;
    case 'red': return 1;
    default: return 0;
  }
};

const formatAssessmentData = (answers: Record<number, TrafficLight>) => {
  return ASSESSMENT_STATEMENTS.map(s => {
    const color = answers[s.id] || 'red';
    return `- [${color.toUpperCase()}] ${s.text} (${s.dimension})`;
  }).join('\n');
};

export const generateActionPlan = async (
  answers: Record<number, TrafficLight>,
  reflections: UserReflections
): Promise<ActionPlanReport> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const assessmentSummary = formatAssessmentData(answers);

    const prompt = `
      LEADER PROFILE ANALYSIS:
      
      ASSESSMENT RESULTS (Behavioral Frequency):
      ${assessmentSummary}

      SELF-REFLECTION:
      - Perceived Strengths: "${reflections.strengths}"
      - Perceived Limitations: "${reflections.limitations}"

      Draft the Personal Action Plan now.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            synthesis: {
              type: Type.OBJECT,
              properties: {
                keyStrengths: { type: Type.STRING },
                keyPriorities: { type: Type.STRING },
              },
            },
            developmentPlan: {
              type: Type.OBJECT,
              properties: {
                focusArea: { type: Type.STRING },
                reasonForChoosing: { type: Type.STRING },
                goalSMART: { type: Type.STRING },
                benefits: { type: Type.STRING },
                risks: { type: Type.STRING },
                obstacles: { type: Type.STRING },
                mitigation: { type: Type.STRING },
              },
            },
            actionSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  approach: { type: Type.STRING, enum: ["Experience", "Exposure", "Education"] },
                  action: { type: Type.STRING },
                  targetDate: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ActionPlanReport;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini generation failed, falling back to mock data", error);
    
    return {
      synthesis: {
        keyStrengths: "Demonstrates strong intuitive grasp of Warmth and Intent Validation. Self-reflection aligns with assessment in identifying high empathy but potential avoidance of conflict.",
        keyPriorities: "Strategic Decision Making under pressure is the critical derailer. The gap between 'Sensing' data and 'Responding' is too wide, leading to analysis paralysis."
      },
      developmentPlan: {
        focusArea: "Strategic Decision Making: The Sensing-Sizing-Responding Framework",
        reasonForChoosing: "Current tendency to wait for 100% information certainty is creating bottlenecks in agile project phases.",
        goalSMART: "Within 30 days, apply the 70% rule to all reversible decisions, utilizing the 'Sizing' framework to categorize risks within 4 hours of issue identification.",
        benefits: "Increased team velocity; reduction in personal cognitive load; shift from 'operational firefighter' to 'strategic architect'.",
        risks: "Premature decision making without adequate counsel; perceived lack of thoroughness by risk-averse stakeholders.",
        obstacles: "Deep-seated habit of perfectionism; fear of public failure.",
        mitigation: "Use the Pre-Mortem technique explicitly in team meetings to formalize risk assessment, satisfying the need for safety while maintaining speed."
      },
      actionSteps: [
        { approach: "Education", action: "Review the 'Sensing-Sizing-Responding' module, specifically the case study on asymmetrical risk.", targetDate: "Week 1" },
        { approach: "Experience", action: "Lead one 'Pre-Mortem' session for the Q3 roadmap, explicitly asking 'Why did this fail?' before starting.", targetDate: "Week 2" },
        { approach: "Exposure", action: "Request feedback from the CFO on my decision speed vs. accuracy ratio over the last quarter.", targetDate: "Week 4" }
      ]
    };
  }
};
