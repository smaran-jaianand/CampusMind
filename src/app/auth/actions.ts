'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';

// ------------------------------
// Validation Schemas
// ------------------------------
const emailSchema = z.string().email({ message: 'Please enter a valid email address.' });
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters long.' });

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const profileUpdateSchema = z.object({
  uid: z.string(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
});


// ------------------------------
// Types
// ------------------------------
export type AuthState = {
  success: boolean;
  message: string;
};


// ------------------------------
// Signup → Create user and set session cookie
// ------------------------------
export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  if (!auth) {
    return { success: false, message: 'Admin authentication is not configured. Please ensure the FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables.' };
  }
  const result = signupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return { success: false, message: result.error.errors.map((e) => e.message).join(' ') };
  }

  const { email, password } = result.data;

  try {
     // This flow now creates the user on the server.
    await auth.createUser({
      email,
      password,
      displayName: email.split('@')[0], // Default display name
    });
    
    return { success: true, message: 'Signup successful! Please log in.' };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { success: false, message: 'An account with this email already exists.' };
    }
    return { success: false, message: 'Signup failed. Please try again.' };
  }
}

// ------------------------------
// Login → Create idToken on client, set session cookie on server
// ------------------------------
export async function login(idToken: string): Promise<AuthState> {
    if (!auth) {
        return { success: false, message: 'Admin authentication is not configured. Please ensure the FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables.' };
    }
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set('firebase-session', sessionCookie, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return { success: true, message: 'Login successful! Redirecting...' };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, message: 'Login failed. Please check your credentials and try again.' };
  }
}

// ------------------------------
// Logout
// ------------------------------
export async function logout() {
  cookies().delete('firebase-session');
  // No need to redirect from here, client will handle it.
  return { success: true, message: 'Logged out successfully.' };
}


// ------------------------------
// Profile Update
// (runs on server, modifies Firebase user)
// ------------------------------
export async function updateUserProfile(data: {
  uid: string;
  displayName?: string;
  photoURL?: string;
}): Promise<AuthState> {
  if (!auth) {
    return { success: false, message: 'Admin authentication is not configured. Please ensure the FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables.' };
  }
  const result = profileUpdateSchema.safeParse(data);

  if (!result.success) {
    return { success: false, message: result.error.errors.map((e) => e.message).join(' ') };
  }

  const { uid, ...profileData } = result.data;

  if (!uid) {
    return { success: false, message: 'User not authenticated.' };
  }

  try {
    await auth.updateUser(uid, profileData);
    return { success: true, message: 'Profile updated successfully.' };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: 'Failed to update profile.' };
  }
}
