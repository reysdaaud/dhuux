// src/lib/firebase.tsx
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  type Auth, 
  type User as FirebaseUser,
  FacebookAuthProvider // Added for Facebook
} from "firebase/auth";
import { getFirestore, type Firestore, doc, getDoc, Timestamp, serverTimestamp as firestoreServerTimestamp } from "firebase/firestore";
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { initializeUserInFirestore } from './userManagement';
import { useRouter, usePathname } from 'next/navigation'; // useRouter for navigation

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAl1iiyOrU49GOJdezPc-6zQPeonpJxl0I",
  authDomain: "wirenext-b4b65.firebaseapp.com",
  projectId: "wirenext-b4b65",
  storageBucket: "wirenext-b4b65.appspot.com", 
  messagingSenderId: "486545175288",
  appId: "1:486545175288:web:6d53203232567ae786810d",
  measurementId: "G-9H1ZKBRWK0"
};

let app: FirebaseApp;
let authInstance: Auth; 
let dbInstance: Firestore; 

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
authInstance = getAuth(app);
dbInstance = getFirestore(app);

export interface UserProfile {
  uid: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  coins?: number;
  paymentHistory?: any[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLogin?: Timestamp;
  firstName?: string;
  lastName?: string;
  country?: string;
  mobile?: string;
  profileComplete?: boolean;
  preferredCategories?: string[];
  isAdmin?: boolean;
  freeContentConsumedCount?: number;
  consumedContentIds?: string[];
  likedContentIds?: string[];
  savedContentIds?: string[];
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  // signInWithFacebook: () => Promise<FirebaseUser | null>; // Temporarily removed as per request
  signOutUser: () => Promise<void>;
  loading: boolean; 
  isUserProfileLoading: boolean;
  error: Error | null; 
  firebaseAuth: Auth;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => { 
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // For Firebase Auth state
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true); // For Firestore profile fetching
  const [error, setError] = useState<Error | null>(null); 
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserProfile = useCallback(async (currentUser: FirebaseUser | null) => {
    if (!currentUser) {
      setUserProfile(null);
      setIsUserProfileLoading(false);
      console.log("[AuthProvider] fetchUserProfile: No current user, profile set to null.");
      return;
    }
    console.log(`[AuthProvider] fetchUserProfile: Fetching profile for user ${currentUser.uid}`);
    setIsUserProfileLoading(true);
    try {
      const userRef = doc(dbInstance, "users", currentUser.uid);
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data() as UserProfile);
        console.log("[AuthProvider] fetchUserProfile: Profile fetched successfully.", userDocSnap.data());
      } else {
        setUserProfile(null); 
        console.warn("[AuthProvider] fetchUserProfile: User document not found in Firestore after initialization attempt.");
      }
    } catch (e) {
      console.error("[AuthProvider] fetchUserProfile: Error fetching user profile:", e);
      setError(e as Error);
      setUserProfile(null);
    } finally {
      setIsUserProfileLoading(false);
      console.log("[AuthProvider] fetchUserProfile: Profile fetching complete.");
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    const currentUser = authInstance.currentUser;
    console.log("[AuthProvider] refreshUserProfile called.");
    if (currentUser) {
      await fetchUserProfile(currentUser);
    } else {
        console.log("[AuthProvider] refreshUserProfile: No current user to refresh profile for.");
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    console.log("[AuthProvider] Setting up onAuthStateChanged listener.");
    const unsubscribe = authInstance.onAuthStateChanged(
      async (currentUser) => {
        console.log("[AuthProvider] onAuthStateChanged triggered. Current user:", currentUser?.uid || "None");
        setLoading(true); // Auth state is changing
        setIsUserProfileLoading(true); // Profile will need to be fetched or cleared
        setUser(currentUser);

        if (currentUser) {
          console.log("[AuthProvider] onAuthStateChanged: User detected. Initializing and fetching profile.");
          try {
            await initializeUserInFirestore(currentUser); // Ensures user doc exists
            await fetchUserProfile(currentUser);         // Fetches the profile data
          } catch (e) {
            console.error("[AuthProvider] onAuthStateChanged: Error during user processing:", e);
            setError(e as Error);
            setUserProfile(null); // Clear profile on error
            setIsUserProfileLoading(false); 
          }
        } else {
          console.log("[AuthProvider] onAuthStateChanged: No user. Clearing profile.");
          setUserProfile(null);
          setIsUserProfileLoading(false);
        }
        setLoading(false); // Auth state is now settled
        console.log("[AuthProvider] onAuthStateChanged: Auth state processing complete. Loading:", false, "isUserProfileLoading:", isUserProfileLoading);
      },
      (err) => { 
        console.error("[AuthProvider] onAuthStateChanged: Listener error:", err);
        setError(err);
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        setIsUserProfileLoading(false);
      }
    );
    return () => {
      console.log("[AuthProvider] Cleaning up onAuthStateChanged listener.");
      unsubscribe();
    };
  }, [fetchUserProfile]);


  useEffect(() => {
    console.log(`[AuthProvider] Redirection check. Auth Loading: ${loading}, Profile Loading: ${isUserProfileLoading}, User: ${user?.uid}, Path: ${pathname}`);

    if (loading || isUserProfileLoading) {
      console.log("[AuthProvider] Redirection check: Auth or profile still loading, waiting.");
      return; // Wait for auth and profile state to settle
    }

    const isAuthPage = pathname === '/auth/signin';
    const isProfileSetupPage = pathname === '/profile/setup';
    const isPreferencesPage = pathname === '/profile/preferences';

    if (user) {
      // User is logged in
      console.log("[AuthProvider] Redirection check: User is logged in.");
      if (isAuthPage) {
        console.log("[AuthProvider] User logged in and on sign-in page, redirecting to /");
        router.replace('/');
        return;
      }

      // Handle onboarding flow:
      // If profile is not complete, and user is not on setup page, redirect to setup.
      if (userProfile && !userProfile.profileComplete && !isProfileSetupPage && !isPreferencesPage) {
          console.log("[AuthProvider] User profile not complete, redirecting to /profile/setup");
          router.replace('/profile/setup');
          return;
      }
      // If profile is complete, but preferences are not, and user is not on preferences page, redirect.
      if (userProfile && userProfile.profileComplete && (!userProfile.preferredCategories || userProfile.preferredCategories.length === 0) && !isPreferencesPage) {
          console.log("[AuthProvider] User profile complete, but no preferences. Redirecting to /profile/preferences");
          router.replace('/profile/preferences');
          return;
      }
      // If user is on profile setup but profile is already complete
      if (userProfile && userProfile.profileComplete && isProfileSetupPage) {
          console.log("[AuthProvider] User on setup page, but profile complete. Redirecting based on preferences.");
          if (!userProfile.preferredCategories || userProfile.preferredCategories.length === 0) {
              router.replace('/profile/preferences');
          } else {
              router.replace('/');
          }
          return;
      }
      // If user is on preferences page but profile isn't complete
      if (userProfile && !userProfile.profileComplete && isPreferencesPage) {
          console.log("[AuthProvider] User on preferences page, but profile incomplete. Redirecting to /profile/setup.");
          router.replace('/profile/setup');
          return;
      }
      // If user is on preferences page and preferences are already set (and profile is complete)
      if (userProfile && userProfile.profileComplete && userProfile.preferredCategories && userProfile.preferredCategories.length > 0 && isPreferencesPage) {
          console.log("[AuthProvider] User on preferences page, but preferences already set. Redirecting to /.");
          router.replace('/');
          return;
      }


    } else {
      // No user is logged in
      console.log("[AuthProvider] Redirection check: No user logged in.");
      if (!isAuthPage) {
        console.log(`[AuthProvider] No user, not on auth page (current: ${pathname}), redirecting to /auth/signin.`);
        router.replace('/auth/signin');
      }
    }
  }, [user, userProfile, loading, isUserProfileLoading, router, pathname]);

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    console.log("[AuthProvider] signInWithGoogle called.");
    // setLoading(true); // onAuthStateChanged will handle loading state updates
    // setIsUserProfileLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authInstance, provider);
      // onAuthStateChanged will handle user initialization, profile fetching, and subsequent redirection.
      console.log("[AuthProvider] signInWithGoogle successful for user:", result.user?.uid);
      return result.user; 
    } catch (error) {
      console.error("[AuthProvider] signInWithGoogle: Error:", error);
      setError(error as Error);
      // setLoading(false); // Handled by onAuthStateChanged
      // setIsUserProfileLoading(false);
      throw error; 
    }
  };
  
  const signOutUser = async (): Promise<void> => {
    console.log("[AuthProvider] signOutUser called.");
    try {
      await signOut(authInstance);
      // onAuthStateChanged will set user and userProfile to null
      // The useEffect for redirection will then send the user to /auth/signin
      console.log("[AuthProvider] signOutUser successful.");
    } catch (error) {
      console.error("[AuthProvider] signOutUser: Error:", error);
      setError(error as Error);
      throw error;
    }
  };

  const contextValue = { 
    user, 
    userProfile, 
    signInWithGoogle,
    signOutUser, 
    loading, 
    isUserProfileLoading, 
    error, 
    firebaseAuth: authInstance,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { authInstance as auth, dbInstance as db, GoogleAuthProvider, Timestamp as FirebaseTimestamp, firestoreServerTimestamp };
export type { AuthContextType as UserAuthContextType }; // Exporting the type
