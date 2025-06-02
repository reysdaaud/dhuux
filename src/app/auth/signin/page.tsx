// src/app/auth/signin/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext'; // Corrected to useAuth
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'; // For logo
import { useToast } from '@/hooks/use-toast'; // Import useToast

const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-.97 2.48-1.94 3.21v2.75h3.57c2.08-1.92 3.28-4.74 3.28-7.97z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
    <path fill="none" d="M1 1h22v22H1z" />
  </svg>
);


export default function SignInPage() {
  const { user, signInWithGoogle, loading: authLoading, isUserProfileLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    // This page doesn't need to do much redirection itself.
    // AuthProvider handles the main logic of where to send a user.
    // We just show a loader if auth state is known and user exists,
    // expecting AuthProvider to redirect shortly.
    if (!authLoading && user && !isUserProfileLoading) {
      // User is loaded, profile is loaded (or attempted). AuthProvider's redirect useEffect should be active.
      // This typically means they should be redirected away from /auth/signin.
      console.log("[SignInPage] User and profile loaded, AuthProvider should be handling redirect.");
    } else if (!authLoading && !user) {
      // Auth is not loading, and there's no user. User should be on this page.
      console.log("[SignInPage] No user, ready for sign-in.");
    }
  }, [user, authLoading, isUserProfileLoading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // AuthProvider's onAuthStateChanged and useEffect will handle the post-login flow (init user, fetch profile, redirect).
      // No explicit router.push('/') here as it's handled by AuthProvider based on profile completeness.
      toast({
        title: 'Sign-In Initiated',
        description: 'Please complete the Google Sign-In.',
      });
    } catch (error: any) {
      console.error('Google Sign-In error on page:', error);
      const authError = error as AuthError; // Cast error for better type checking

      // Check for specific error codes to prevent showing a toast
      if (authError.code === 'auth/popup-closed-by-user' || authError.code === 'auth/cancelled-popup-request') {
        console.info('Sign-in popup was closed or cancelled by the user. No toast shown.');
        // Do nothing - no toast message for these specific errors
      } else if (error.message) {
        // For other errors, show a destructive toast
        toast({
          title: 'Sign In Failed',
          description: authError.message || 'An unexpected error occurred during sign-in. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Show a comprehensive loading state if either Firebase auth is loading,
  // or if a user exists but their Firestore profile is still being fetched.
  if (authLoading || (user && isUserProfileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        {/* Replaced specific loading messages with a general one */}
        <p className="ml-3 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  // If user is already logged in AND profile is loaded, AuthProvider's useEffect should redirect them.
  // This state indicates the user might be briefly on this page before that redirect happens.
  if (user && !isUserProfileLoading) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        {/* Replaced specific loading messages with a general one */}
        <p className="ml-3 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not loading and no user, show the sign-in form.
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Sign In to KeyFind</CardTitle>
          <CardDescription>
            Access your secure content and features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
            <GoogleIcon /> Sign In with Google
          </Button>
          <p className="text-xs text-center text-muted-foreground pt-2">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
