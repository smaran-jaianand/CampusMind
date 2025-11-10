
'use server';

import {
  generateInitialResponse,
  type GenerateInitialResponseOutput,
} from '@/ai/flows/generate-initial-response';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, getDocs, Timestamp, orderBy } from 'firebase/firestore/lite';
import { auth } from '@/lib/firebase';


export async function getAiResponse(
  userInput: string,
  userId: string
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



const sendSupportEmailSchema = z.object({
  toEmail: z.string().email(),
  fromEmail: z.string().email().optional(),
  subject: z.string(),
  body: z.string(),
});

export async function sendSupportEmail(formData: FormData): Promise<{success: boolean; message: string}> {
  const result = sendSupportEmailSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { success: false, message: 'Invalid form data.' };
  }
  
  const { toEmail, fromEmail, subject, body } = result.data;
  
  // IMPORTANT: You must configure these environment variables with your email provider's details.
  // For example, using Gmail, you would need to set up an "App Password".
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_PORT === '465'), // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify(); // Verify connection configuration
  } catch (error) {
    console.error("Email transporter configuration error:", error);
    return { success: false, message: 'Could not connect to email server. Please check server configuration.' };
  }

  const finalBody = fromEmail 
    ? `${body}\n\n--- \nThis message was sent from ${fromEmail}`
    : body;

  try {
    await transporter.sendMail({
      from: `"CampusMind Support" <${process.env.SMTP_USER}>`, // sender address
      to: toEmail, // list of receivers
      subject: subject, // Subject line
      text: finalBody, // plain text body
      html: `<p>${finalBody.replace(/\n/g, '<br>')}</p>`, // html body
    });

    return { success: true, message: 'Support email sent successfully.' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'An error occurred while trying to send the email.' };
  }
}

