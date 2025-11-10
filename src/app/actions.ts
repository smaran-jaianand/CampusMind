
'use server';

import {
  generateInitialResponse,
  type GenerateInitialResponseOutput,
} from '@/ai/flows/generate-initial-response';


export async function getAiResponse(
  userInput: string
): Promise<GenerateInitialResponseOutput> {
  try {
    // Then, get the AI's response
    const response = await generateInitialResponse({ userInput });
    return response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      response: "I'm sorry, but I'm having trouble connecting right now. Please try again in a moment.",
    };
  }
}
