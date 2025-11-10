// triage-user-need.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for the AI-guided first-aid chatbot.
 *
 * It includes:
 * - `triageUserNeed`: The main function to triage user needs and suggest resources.
 * - `TriageUserNeedInput`: The input type for the `triageUserNeed` function.
 * - `TriageUserNeedOutput`: The output type for the `triageUserNeed` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriageUserNeedInputSchema = z.object({
  userInput: z
    .string()
    .describe(
      'The user input describing their current mental or emotional state.'
    ),
});

export type TriageUserNeedInput = z.infer<typeof TriageUserNeedInputSchema>;

const TriageUserNeedOutputSchema = z.object({
  triageResult: z
    .string()
    .describe(
      'A summary of the user needs and recommended resources or actions. If the user expresses thoughts of self-harm, direct them to immediate professional help.'
    ),
  suggestedResources: z
    .array(z.string())
    .describe(
      'A list of suggested resources (e.g., "booking", "resources") based on the user input. Empty if no resources are needed.'
    ),
  escalateToProfessional: z
    .boolean()
    .describe(
      'Whether the situation requires immediate escalation to a professional mental health resource.'
    ),
});

export type TriageUserNeedOutput = z.infer<typeof TriageUserNeedOutputSchema>;

export async function triageUserNeed(input: TriageUserNeedInput): Promise<TriageUserNeedOutput> {
  return triageUserNeedFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: TriageUserNeedInputSchema},
  output: {schema: TriageUserNeedOutputSchema},
  prompt: `You are a triage system for CampusMind, a supportive AI friend. Your job is to analyze the user's message to determine if they need help and what kind of help that might be. You do not respond to the user, you only categorize their need.

### Triage Categories:
1.  **General Chat:** User is just talking, asking questions, or expressing mild feelings.
    - `escalateToProfessional`: false
    - `suggestedResources`: []
    - `triageResult`: "General conversation, no immediate resources needed."

2.  **Needs Resources:** User is stressed, lonely, or looking for information on coping, meditation, etc.
    - `escalateToProfessional`: false
    - `suggestedResources`: ["resources"]
    - `triageResult`: "User is seeking information or coping strategies."

3.  **Needs to Book Appointment:** User is expressing a desire to talk to someone, feeling overwhelmed by a specific, ongoing issue (like academic pressure, anxiety).
    - `escalateToProfessional`: false
    - `suggestedResources`: ["booking"]
    - `triageResult`: "User may benefit from talking to a counselor."

4.  **Urgent/Crisis:** User mentions self-harm, suicide, hopelessness, or being in immediate danger. This is the highest priority.
    - `escalateToProfessional`: true
    - `suggestedResources`: []
    - `triageResult`: "User is in distress and requires immediate escalation to professional help."

---
### Examples:

**User Input:** "I'm so stressed about my exams, I don't know what to do."
**Triage Output:**
{
  "triageResult": "User is seeking information or coping strategies.",
  "suggestedResources": ["resources", "booking"],
  "escalateToProfessional": false
}


**User Input:** "i feel so lonely here"
**Triage Output:**
{
  "triageResult": "User may benefit from talking to a counselor.",
  "suggestedResources": ["booking"],
  "escalateToProfessional": false
}

**User Input:** "I can't do this anymore. It's all pointless."
**Triage Output:**
{
  "triageResult": "User is in distress and requires immediate escalation to professional help.",
  "suggestedResources": [],
  "escalateToProfessional": true
}

**User Input:** "Hey what's up"
**Triage Output:**
{
  "triageResult": "General conversation, no immediate resources needed.",
  "suggestedResources": [],
  "escalateToProfessional": false
}

---

**Analyze the following user input and provide the triage output in the specified JSON format.**

**User Input:** {{{userInput}}}
`,
});

const triageUserNeedFlow = ai.defineFlow(
  {
    name: 'triageUserNeedFlow',
    inputSchema: TriageUserNeedInputSchema,
    outputSchema: TriageUserNeedOutputSchema,
  },
  async input => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);
