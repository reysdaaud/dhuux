
// src/app/page.tsx (Based on backup_main version, integrating SoundsContent and ArticleContent)
'use client';

import React, { Suspense } from 'react';
import TopHeader from '@/components/exchange/TopHeader';
import UserActions from '@/components/exchange/UserActions';
import MarketSection from '@/components/exchange/MarketSection';
import BottomNavBar from '@/components/exchange/BottomNavBar';
import CardBalance from '@/components/exchange/CardBalance';
import SoundsContent from '@/components/sounds/SoundsContent'; // For the "Sounds" tab
import ArticleContent from '@/components/articles/ArticleContent'; // For the "Articles" tab
import PlayerBar from '@/components/library/PlayerBar';
import FullScreenPlayer from '@/components/player/FullScreenPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { useSearchParams, useRouter as useNextRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot, getDoc, updateDoc, arrayUnion, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, FirebaseTimestamp } from '@/lib/firebase';


function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading page...</p>
    </div>
  );
}

function HomePageContent() {
  const { user, loading: authLoading, userProfile, isUserProfileLoading } = useAuth();
  const { currentTrack, isPlayerOpen } = usePlayer();
  const nextRouter = useNextRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [coinBalance, setCoinBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('Home');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [userDocLoading, setUserDocLoading] = useState(true);
  
  const paymentBackendUrl = process.env.NEXT_PUBLIC_PAYMENT_BACKEND_URL || 'https://backend-aroy.onrender.com';

  useEffect(() => {
    console.log(`[HomePageContent Effect] Auth State Change. AuthLoading: ${authLoading}, User: ${!!user}, UserProfileLoading: ${isUserProfileLoading}`);
    if (!authLoading && user) {
      setUserDocLoading(true);
      const userRef = doc(db, 'users', user.uid);
      console.log(`[HomePageContent Effect] Setting up Firestore listener for user: ${user.uid}`);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          console.log(`[HomePageContent Effect] User doc snapshot received for ${user.uid}. Coins:`, docSnap.data().coins);
          setCoinBalance(docSnap.data().coins || 0);
        } else {
          console.warn(`[HomePageContent Effect] User document for ${user.uid} not found. Balance set to 0.`);
          setCoinBalance(0);
        }
        setUserDocLoading(false);
      }, (error) => {
        console.error("[HomePageContent Effect] Error listening to user balance:", error);
        toast({ title: "Error", description: "Could not load your coin balance.", variant: "destructive" });
        setUserDocLoading(false);
      });
      return () => {
        console.log(`[HomePageContent Effect] Unsubscribing Firestore listener for user: ${user.uid}`);
        unsubscribe();
      };
    } else if (!authLoading && !user) {
      // No user, not loading auth - ensure redirection if not on auth page handled by AuthProvider
      // For this page, if no user, we just set loading to false and coin balance to 0
      console.log("[HomePageContent Effect] No user and auth not loading. Setting userDocLoading false, balance 0.");
      setUserDocLoading(false);
      setCoinBalance(0);
    } else {
      // Auth is loading or no user yet, ensure userDocLoading is true
      console.log("[HomePageContent Effect] Auth is loading. Setting userDocLoading true, balance 0.");
      setUserDocLoading(true); 
      setCoinBalance(0);
    }
  }, [user, authLoading, toast]); // Removed nextRouter from deps as AuthProvider handles main redirects


  const handleVerifyPayment = useCallback(async (paymentReference: string) => {
    console.log(`[FrontendVerify] Starting payment verification for reference: ${paymentReference}`);
    if (!user) {
      console.error("[FrontendVerify] User not available for payment verification. Cannot proceed.");
      toast({ title: 'Authentication Error', description: 'User session not found. Please sign in again.', variant: 'destructive' });
      setIsVerifyingPayment(false);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('trxref');
      currentUrl.searchParams.delete('reference');
      nextRouter.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
      return;
    }

    if (isVerifyingPayment) {
      console.log("[FrontendVerify] Verification already in progress for reference:", paymentReference);
      return;
    }
    setIsVerifyingPayment(true);
    toast({ title: "Verifying Payment...", description: "Please wait while we confirm your transaction." });

    const verifyUrl = `${paymentBackendUrl}/paystack/verify/${paymentReference}`;
    console.log(`[FrontendVerify] Calling backend verification URL: GET ${verifyUrl}`);

    try {
      const response = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('[FrontendVerify] Backend verification raw response status:', response.status);

      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
          result = await response.json();
          console.log('[FrontendVerify] Response from backend /paystack/verify (JSON):', result);
      } else {
          const textResponse = await response.text();
          console.error("[FrontendVerify] Backend verification response was not JSON. Status:", response.status, "Body:", textResponse.substring(0, 200) + "...");
          throw new Error(`Backend verification error. Status: ${response.status}. Response: ${textResponse.substring(0, 100)}...`);
      }
      
      if (response.ok && result.status && result.data && result.data.status === 'success') {
        toast({
          title: 'Payment Successful!',
          description: result.internal_message || `${result.data.metadata?.coins || 0} coins added. Balance will update shortly.`,
          variant: 'default',
          duration: 7000,
        });
      } else {
         console.error('[FrontendVerify] Backend verification indicated failure or unexpected structure:', result);
        toast({
          title: 'Payment Verification Issue',
          description: result.message || result.internal_message || 'There was an issue confirming your payment. If debited, contact support.',
          variant: 'destructive',
          duration: 10000,
        });
      }
    } catch (error: any) {
      console.error('[FrontendVerify] Error calling backend /paystack/verify or processing its response:', error);
      let displayError = 'Unexpected error during verification. Please contact support if debited.';
      if (error.message && error.message.includes('Failed to fetch')) {
        displayError = `Failed to connect to verification server. Please check your connection or contact support. URL: ${verifyUrl}`;
      } else if (error.message) {
        displayError = error.message;
      }
      toast({
        title: 'Verification System Error',
        description: displayError,
        variant: 'destructive',
        duration: 10000,
      });
    } finally {
      setIsVerifyingPayment(false);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('trxref');
      currentUrl.searchParams.delete('reference');
      nextRouter.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
    }
  }, [toast, nextRouter, user, isVerifyingPayment, paymentBackendUrl]);


  useEffect(() => {
    if (authLoading || isUserProfileLoading || !user) {
      console.log(`[FrontendVerify Effect] Skipping payment verification due to loading states or no user. Auth: ${authLoading}, Profile: ${isUserProfileLoading}, User: ${!!user}`);
      return;
    }

    const paymentReference = searchParams.get('trxref') || searchParams.get('reference');

    if (paymentReference && !isVerifyingPayment) {
      const verificationKey = `verified_${paymentReference}`;
      if (sessionStorage.getItem(verificationKey) !== 'true') {
        sessionStorage.setItem(verificationKey, 'true'); 
        console.log("[FrontendVerify Effect] Detected payment reference, user is available. Calling handleVerifyPayment for reference:", paymentReference);
        handleVerifyPayment(paymentReference);
      } else {
        console.log("[FrontendVerify Effect] Payment reference already processed (session storage check):", paymentReference);
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.get('trxref') || currentUrl.searchParams.get('reference')) {
            currentUrl.searchParams.delete('trxref');
            currentUrl.searchParams.delete('reference');
            nextRouter.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
        }
      }
    }
  }, [searchParams, user, authLoading, isVerifyingPayment, handleVerifyPayment, nextRouter, isUserProfileLoading]);


  if (authLoading || isUserProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading user session...</p>
      </div>
    );
  }

  // AuthProvider handles redirection if !user and not on /auth/signin
  // So, if we reach here and !user, AuthProvider might be about to redirect.
  // However, if AuthProvider logic is such that it *allows* '/' for non-users briefly, this check is a safeguard.
  if (!user) {
    // This should ideally not be hit if AuthProvider correctly redirects unauth users away from '/'
    console.warn("[HomePageContent] No user, but not caught by AuthProvider's redirect. Displaying loader.");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Session loading...</p>
      </div>
    );
  }
  
  // This condition checks if user data is loading but it's not due to a payment verification redirect
  if (userDocLoading && !(searchParams.get('trxref') || searchParams.get('reference'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading your data...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (isPlayerOpen) return null;

    switch (activeTab) {
      case 'Home':
        return (
          <>
            <Card className="mb-4 bg-card border-border shadow-lg">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-lg text-primary">Dhuux</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-2">
                <p className="text-2xl font-semibold text-foreground">
                  Coin Balance: {coinBalance.toLocaleString()} Coins
                </p>
                 <p className="text-sm text-muted-foreground mt-1">
                  Manage your digital assets with ease.
                </p>
              </CardContent>
            </Card>
            <CardBalance />
            <UserActions setCoinBalance={setCoinBalance} />
            <MarketSection /> 
          </>
        );
      case 'Sounds': // Changed from 'Library' to 'Sounds'
        return <SoundsContent />;
      case 'Markets': 
        return <MarketSection /> 
      case 'Articles': // Added Articles tab content
        return <ArticleContent />;
      case 'Trade': 
        return (
             <div className="text-center py-10 px-4">
                <p className="text-muted-foreground">Trade section is currently not directly accessible via main navigation.</p>
                <MarketSection />
            </div>
        );
      default:
        return (
          <div className="text-center py-10 px-4">
            <p className="text-muted-foreground">Content for {activeTab} tab.</p>
          </div>
        );
    }
  };
  
  let mainPaddingBottom = 'pb-16';
  if (currentTrack && !isPlayerOpen) { 
    mainPaddingBottom = 'pb-28'; 
  } else if (isPlayerOpen) {
    mainPaddingBottom = 'pb-0';
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isPlayerOpen && <TopHeader />}
      <main className={`flex-grow overflow-y-auto ${mainPaddingBottom} md:pb-0 px-4 pt-3`}>
        {renderContent()}
      </main>
      {currentTrack && !isPlayerOpen && <PlayerBar />}
      {isPlayerOpen && <FullScreenPlayer />}
      {!isPlayerOpen && <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomePageContent />
    </Suspense>
  );
}
