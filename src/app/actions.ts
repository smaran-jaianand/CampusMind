
'use server';

import {
  generateInitialResponse,
  type GenerateInitialResponseOutput,
} from '@/ai/flows/generate-initial-response';
import { scheduleTasks, ScheduleTasksOutput } from '@/ai/flows/schedule-tasks';
import { z } from 'zod';
import { adminApp, auth as adminAuth } from '@/lib/firebase-admin';

export async function getAiResponse(
  userInput: string
): Promise<GenerateInitialResponseOutput> {
  try {
    const response = await generateInitialResponse({ userInput });
    return response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      response: "I'm sorry, but I'm having trouble connecting right now. Please try again in a moment.",
    };
  }
}

const scheduleTasksServerActionInput = z.object({
  tasks: z.array(z.string()),
  consultationSummary: z.string(),
});

export async function scheduleTasksAction(
  input: z.infer<typeof scheduleTasksServerActionInput>
): Promise<ScheduleTasksOutput> {
  return await scheduleTasks(input);
}


export async function getAllUsers() {
  if (!adminAuth) {
    throw new Error('Admin auth not configured');
  }
  const users = await adminAuth.listUsers();
  return users.users.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    disabled: user.disabled,
  }));
}

export async function updateUserDisabledStatus(uid: string, disabled: boolean) {
  if (!adminAuth) {
    throw new Error('Admin auth not configured');
  }
  await adminAuth.updateUser(uid, { disabled });
  return { success: true };
}
