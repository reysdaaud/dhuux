
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WaafiButtonProps {
  amount: number; // This is the KES amount from the package
  currency: string; // Expected to be "USD", passed to API
  phoneNumber: string;
  userId: string;
  metadata: { // Metadata sent to your backend API
    coins: number;
    packageName: string;
    originalAmountKES: number; // KES amount before any conversion
    userId: string; // Include userId in metadata for the backend
    userEmail?: string | null;
  };
  // onCloseDialog?: () => void; // Kept this optional as in original
}

const WaafiButton: React.FC<WaafiButtonProps> = ({
  amount, // KES amount from package
  currency, // Should be "USD" if Waafi processes in USD
  phoneNumber,
  userId, // userId is top-level prop now, also in metadata for backend
  metadata,
  // onCloseDialog,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleWaafiPayment = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your Waafi phone number.",
        variant: "destructive",
      });
      return;
    }
    // Basic validation for Somali numbers, adjust if needed
    // Typically, Somali numbers start with 252 followed by 9 digits (e.g., 25261xxxxxxx, 25262xxxxxxx, etc.)
    // Or just 9 digits if '252' is implied or handled by gateway.
    // The regex /^\d{9,15}$/ checks for 9 to 15 digits.
    // A more specific regex might be /^252[6-9]\d{7}$/ for numbers including country code,
    // or /^[6-9]\d{8}$/ for numbers without country code if '252' is prepended by gateway.
    // For now, using a general digit check.
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-digits
    if (!/^\d{9,15}$/.test(cleanedPhoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (9-15 digits).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    let responseData: any; // To store parsed JSON response

    console.log('[WaafiButton] Initiating payment with payload for API:', {
        amount, // KES amount
        currency, // e.g., "USD"
        phoneNumber: cleanedPhoneNumber, // Use cleaned phone number
        userId, // Pass top-level userId
        metadata: { // Metadata for your backend
            ...metadata, // Includes coins, packageName, originalAmountKES
            userId, // ensure userId is in metadata as well for backend to easily find
        },
    });


    try {
      const response = await fetch("/api/waafi/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount, // This is the KES amount from the package
          currency, // This will be "USD" as set in Pay.tsx
          phoneNumber: cleanedPhoneNumber, // Send the cleaned phone number
          userId, // Send userId directly
          metadata: metadata, // Send the full metadata object
        }),
      });

      const contentType = response.headers.get("content-type");
      console.log('[WaafiButton] Response status from /api/waafi/initiate:', response.status);
      console.log('[WaafiButton] Response content-type:', contentType);


      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log('[WaafiButton] Parsed JSON response from API:', responseData);
      } else {
        const responseText = await response.text();
        console.error('[WaafiButton] Waafi initiation failed. Server response was not JSON:', responseText.substring(0, 500) + "...");
        toast({
          title: "Waafi Initiation Error",
          description: `Server error: ${response.status}. Please check console or try again later.`,
          variant: "destructive",
        });
        // It's important to throw an error here to stop execution and go to the finally block
        throw new Error(
          `Failed to initiate Waafi payment. Server responded with ${response.status} and non-JSON content.`
        );
      }

      // Check if the response was successful (HTTP 2xx) AND if the business logic succeeded (responseData.success)
      if (!response.ok || !responseData.success) {
         console.error('[WaafiButton] Waafi API Error Response (from our API route):', responseData);
        toast({
          title: "Waafi Initiation Error",
          description:
            responseData.message ||
            `Payment initiation failed. Status: ${response.status}`,
          variant: "destructive",
        });
        throw new Error(
          responseData.message ||
            `Failed to initiate payment with Waafi. Status: ${response.status}`
        );
      }

      // If initiation was successful according to our backend
      toast({
        title: "Waafi Payment Initiated",
        description:
          responseData.message || // Message from our backend's successful initiation
          "Please check your phone to authorize the payment.",
      });
      // Optionally close the dialog if needed:
      // if(onCloseDialog) onCloseDialog();
    } catch (error: any) {
      console.error('[WaafiButton] Catch block error:', error.message);
      // Ensure we don't try to access error.message if error is not an Error instance
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Waafi Payment Error",
        description:
          errorMessage || "Could not start Waafi payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleWaafiPayment}
      disabled={isLoading || !phoneNumber.trim()}
      className="send-money-button w-full text-sm py-2.5" // Assuming send-money-button class provides good styling
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {isLoading ? "Processing..." : `Pay with Waafi`}
    </Button>
  );
};

export default WaafiButton;
