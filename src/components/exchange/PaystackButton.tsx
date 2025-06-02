
"use client";

import React, { useState } from 'react';
import { auth } from '@/lib/firebase'; 
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaystackButtonProps {
  amount: number; 
  email: string;
  userId: string;
  metadata: {
    coins: number;
    packageName: string;
    userName?: string; // Added for consistency, might be useful for backend
    userEmail?: string; // Added for consistency
  };
}

const PaystackButton = ({ amount, email, userId, metadata }: PaystackButtonProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const user = auth.currentUser; 
  
  const paymentBackendUrl = process.env.NEXT_PUBLIC_PAYMENT_BACKEND_URL || 'http://localhost:5000';

  const handlePayment = async () => {
    setError(null);
    setIsLoading(true);
    console.log('[PaystackButton] handlePayment initiated.');

    if (!user?.email) {
      const msg = 'Please ensure your email is verified before making a purchase.';
      setError(msg);
      toast({ title: "Email Required", description: msg, variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (!email) {
      const msg = 'A valid email address is required for payment.';
      setError(msg);
      toast({ title: "Email Required", description: msg, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const payload = {
      email,
      amount, // KES amount, backend server.js will multiply by 100 for kobo/cents
      metadata: {
        userId,
        coins: metadata.coins,
        packageName: metadata.packageName,
        userName: user?.displayName || 'N/A', // Pass user's name
        userEmail: user?.email, // Pass user's email
      }
    };
    console.log('[PaystackButton] Payload for backend:', JSON.stringify(payload, null, 2));

    const backendInitializeUrl = `${paymentBackendUrl}/paystack/initialize`;
    console.log('[PaystackButton] Attempting to call backend initialization URL:', backendInitializeUrl);

    try {
      const response = await fetch(backendInitializeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[PaystackButton] Backend initialization raw response status:', response.status);

      const responseData = await response.json();
      console.log('[PaystackButton] Parsed backend initialization responseData:', responseData);


      if (!response.ok || !responseData.status) { // Paystack API (via your backend) typically returns `status: true` on success
        const errorMsg = responseData.message || `Backend initialization error. Status: ${response.status}`;
        console.error('[PaystackButton] Backend initialization failed:', errorMsg, 'Full responseData:', responseData);
        throw new Error(errorMsg + ` [PSK_BE_INIT_FAIL]`);
      }

      const authorizationUrl = responseData.data?.authorization_url;
      if (authorizationUrl) {
        console.log('[PaystackButton] Received authorization_url. Opening in new tab:', authorizationUrl);
        window.open(authorizationUrl, '_blank'); // Open Paystack checkout in a new tab
        toast({
          title: 'Redirecting to Paystack',
          description: 'Please complete your payment in the new tab.',
        });
      } else {
        console.error('[PaystackButton] Authorization URL not found in backend response. Data:', responseData);
        throw new Error('Authorization URL not found in backend response. [NO_AUTH_URL_BE]');
      }
    } catch (err: any) {
      console.error('[PaystackButton] Error during payment setup (fetch or subsequent logic):', err);
      let displayError = 'An unexpected error occurred during payment setup.';
      if (err.message.includes('Failed to fetch')) {
        displayError = `Failed to connect to payment server at ${backendInitializeUrl}. Please ensure the backend server is running.`;
      } else {
        displayError = err.message;
      }
      setError(displayError);
      toast({
        title: 'Payment Setup Error',
        description: displayError,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="text-center">
      {error && (
        <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 border border-destructive rounded-md">
          {error}
        </div>
      )}
      <Button
        onClick={handlePayment}
        disabled={isLoading || !user?.email}
        className="send-money-button w-full text-sm py-2.5" 
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} 
        {isLoading ? 'Processing...' : `Pay KES ${amount.toLocaleString()}`}
      </Button>
      {!user?.email && (
        <p className="text-xs text-destructive mt-2">Please ensure your email is verified to make a purchase.</p>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        You will be redirected to Paystack in a new tab to complete your payment securely.
      </p>
    </div>
  );
};

export default PaystackButton;
