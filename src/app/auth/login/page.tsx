'use client';

import { useEffect, useState, useTransition } from 'react';
import { login } from '@/app/auth/actions';
import type { AuthState } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  type UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';

const initialLoginState: AuthState = {
  success: false,
  message: '',
};

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.24,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<AuthState>(initialLoginState);
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [phoneAuthState, setPhoneAuthState] = useState<'idle' | 'otp-sent' | 'verifying'>('idle');


  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Login Successful!',
        description: state.message,
      });
      router.replace('/');
    } else if (state.message) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.message,
      });
       // Reset state to allow user to try again
      setState(initialLoginState);
    }
  }, [state, router, toast]);

  const handleServerLogin = async (idToken: string) => {
    const result = await login(idToken);
    setState(result);
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    startTransition(async () => {
      try {
        let userCredential: UserCredential;
        
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          // Special case for admin: create account on first login
          if (email === 'admin@mannan.app' && error.code === 'auth/user-not-found') {
             await createUserWithEmailAndPassword(auth, email, password);
             // After creation, sign in again to get the user credential
             userCredential = await signInWithEmailAndPassword(auth, email, password);
          } else {
            // For all other errors, re-throw to be caught by the outer catch block
            throw error;
          }
        }
        
        const idToken = await userCredential.user.getIdToken();
        await handleServerLogin(idToken);

      } catch (error: any) {
        const defaultMessage = 'An unknown error occurred.';
        const message = error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password.'
          : error.message || defaultMessage;
        
        setState({ success: false, message });
      }
    });
  };

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const idToken = await userCredential.user.getIdToken();
        await handleServerLogin(idToken);
      } catch (error: any) {
        setState({ success: false, message: error.message || 'Google sign-in failed.' });
      }
    });
  };
  
  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }

  const handlePhoneSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setPhoneAuthState('verifying');
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      try {
        const result = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier);
        setConfirmationResult(result);
        setPhoneAuthState('otp-sent');
        toast({ title: "OTP Sent!", description: `An OTP has been sent to +${phone}` });
      } catch (error: any) {
        setPhoneAuthState('idle');
        setState({ success: false, message: error.message || "Failed to send OTP." });
      }
    });
  }

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    startTransition(async () => {
      try {
        const userCredential = await confirmationResult.confirm(otp);
        const idToken = await userCredential.user.getIdToken();
        await handleServerLogin(idToken);
      } catch (error: any) {
         setState({ success: false, message: error.message || "Invalid OTP." });
      }
    });
  }


  return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Choose a login method to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {phoneAuthState === 'idle' && (
            <>
              <form onSubmit={handleFormSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Logging In...' : 'Login with Email'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleGoogleSignIn} disabled={isPending}>
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  Google
                </Button>
                <Button variant="outline" onClick={() => setPhoneAuthState('verifying')} disabled={isPending}>
                  <Smartphone className="mr-2 h-5 w-5" />
                  Phone
                </Button>
              </div>
            </>
          )}

          {phoneAuthState !== 'idle' && (
             <form onSubmit={phoneAuthState === 'otp-sent' ? handleOtpVerify : handlePhoneSignIn} className="grid gap-4">
                {phoneAuthState === 'verifying' ? (
                   <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <p className="text-xs text-muted-foreground">Include country code without the `+' symbol.</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input id="otp" name="otp" type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  </div>
                )}
              <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Verifying...' : (phoneAuthState === 'otp-sent' ? 'Verify OTP' : 'Send OTP')}
              </Button>
              <Button variant="link" size="sm" onClick={() => { setPhoneAuthState('idle'); setPhone(''); setOtp(''); }}>
                Back to other login methods
              </Button>
            </form>
          )}

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
        <div id="recaptcha-container"></div>
      </Card>
  );
}
