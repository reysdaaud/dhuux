// src/components/articles/ArticleContent.tsx
'use client';

import type { FC } from 'react';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp, limit, documentId, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContentItem } from '@/services/contentService';
import { Loader2, AlertTriangle, Newspaper, Heart, Library as LibraryLucideIcon } from 'lucide-react';
import ArticleCard from './ArticleCard';
import { Button } from '@/components/ui/button';
import SubTabs from '@/components/shared/SubTabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { checkAndGrantContentAccess, LOW_BALANCE_THRESHOLD } from '@/lib/contentAccess'; // Removed CONTENT_COST as it's internal to contentAccess

type ArticlesSubTab = 'All' | 'My Library' | 'Liked Articles' | 'Most Viewed';

const ArticleContentInternal: FC = () => {
  const { user, userProfile, loading: authLoading, isUserProfileLoading, refreshUserProfile } = useAuth();
  const { toast } = useToast();

  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<ArticlesSubTab>('All');
  const subTabFilters: ArticlesSubTab[] = ['All', 'My Library', 'Liked Articles', 'Most Viewed'];
  // articleAccessInfo state removed, as consumption is now immediate via checkAndGrantContentAccess

  const fetchArticlesData = useCallback(async (
    tab: ArticlesSubTab,
    profileForQuery: typeof userProfile | null,
    currentUserId?: string
  ) => {
    console.log(`[ArticleContent] Fetching articles. Tab: ${tab}, UserID: ${currentUserId}, Profile loaded: ${!!profileForQuery}`);
    setIsLoading(true);
    setCurrentError(null);
    setArticles([]); // Clear previous articles
    let fetchedItems: ContentItem[] = [];
    let shouldFetchFromFirestore = true;

    try {
      const contentCollectionRef = collection(db, 'content');
      let finalQueryConstraints: QueryConstraint[] = [where('contentType', '==', 'article')];

      switch (tab) {
        case 'My Library':
          if (currentUserId && profileForQuery?.savedContentIds && profileForQuery.savedContentIds.length > 0) {
            const savedIds = profileForQuery.savedContentIds;
            console.log(`[ArticleContent] Fetching "My Library" for user ${currentUserId}, saved IDs:`, savedIds);
            const chunks = []; for (let i = 0; i < savedIds.length; i += 30) { chunks.push(savedIds.slice(i, i + 30)); }
            for (const chunk of chunks) {
              if (chunk.length > 0) {
                const q = query(contentCollectionRef, where('contentType', '==', 'article'), where(documentId(), 'in', chunk));
                const querySnapshot = await getDocs(q);
                fetchedItems.push(...querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem)));
              }
            }
          } else {
            console.log(`[ArticleContent] "My Library" tab: No user/profile or no saved IDs. Skipping Firestore fetch.`);
            shouldFetchFromFirestore = false;
          }
          break;
        case 'Liked Articles':
          if (currentUserId && profileForQuery?.likedContentIds && profileForQuery.likedContentIds.length > 0) {
            const likedIds = profileForQuery.likedContentIds;
            console.log(`[ArticleContent] Fetching "Liked Articles" for user ${currentUserId}, liked IDs:`, likedIds);
            const chunks = []; for (let i = 0; i < likedIds.length; i += 30) { chunks.push(likedIds.slice(i, i + 30)); }
            for (const chunk of chunks) {
              if (chunk.length > 0) {
                const q = query(contentCollectionRef, where('contentType', '==', 'article'), where(documentId(), 'in', chunk));
                const querySnapshot = await getDocs(q);
                fetchedItems.push(...querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem)));
              }
            }
          } else {
            console.log(`[ArticleContent] "Liked Articles" tab: No user/profile or no liked IDs. Skipping Firestore fetch.`);
            shouldFetchFromFirestore = false;
          }
          break;
        case 'Most Viewed':
          console.warn("[ArticleContent] 'Most Viewed' tab is a placeholder. Fetching 'All' articles instead.");
          finalQueryConstraints.push(orderBy('createdAt', 'desc'), limit(20)); // Fallback to 'All'
          break;
        case 'All':
        default:
          console.log(`[ArticleContent] Fetching "All" articles.`);
          finalQueryConstraints.push(orderBy('createdAt', 'desc'), limit(20));
          break;
      }
      
      if (shouldFetchFromFirestore && (tab === 'All' || tab === 'Most Viewed')) {
        const articlesQuery = query(contentCollectionRef, ...finalQueryConstraints);
        const querySnapshot = await getDocs(articlesQuery);
        fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
      }
      
      console.log(`[ArticleContent] Raw fetched items from Firestore for tab "${tab}": ${fetchedItems.length}`);
      
      let validItems = fetchedItems.filter(item => {
        const isArticle = item.contentType === 'article';
        const hasRequiredFields = item.title && item.imageUrl && item.fullBodyContent && item.dataAiHint;
        if (!isArticle || !hasRequiredFields) {
          // console.log(`[ArticleContent] Item ${item.id} ('${item.title}') filtered out client-side. Type: ${item.contentType}, HasRequiredFields: ${hasRequiredFields}`);
          return false;
        }
        return true;
      }).map(item => ({
          ...item,
          createdAt: item.createdAt instanceof Timestamp ? item.createdAt 
                     : (item.createdAt && typeof (item.createdAt as any).seconds === 'number') 
                       ? new Timestamp((item.createdAt as any).seconds, (item.createdAt as any).nanoseconds) 
                       : undefined, // Or new Date(0) if a default date is preferred over undefined
      }));
      
      console.log(`[ArticleContent] Processed ${validItems.length} valid articles for tab "${tab}" after client-side validation.`);

      // Removed the logic that filters out consumed items for "All" / "Most Viewed" tabs
      // Content now remains visible.

      setArticles(validItems);

    } catch (err: any) {
      console.error(`[ArticleContent] Error fetching articles for tab ${tab}. Raw Error:`, err);
      let specificErrorMsg = `Failed to load articles for ${tab}. Please try again later.`;
      if (err.code === 'failed-precondition') {
        specificErrorMsg = `Firestore query for articles (tab: ${tab}) requires an index. Check console for link. Error: ${err.message}`;
      } else if (err.code === 'permission-denied') {
        specificErrorMsg = `Permission denied fetching articles for ${tab}. Check Firestore rules.`;
      } else if (err.message) {
        specificErrorMsg = err.message;
      }
      setCurrentError(specificErrorMsg);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

 useEffect(() => {
    console.log(`[ArticleContent Effect] Triggering fetch. ActiveTab: ${activeSubTab}, AuthLoading: ${authLoading}, UserProfileLoading: ${isUserProfileLoading}, User: ${!!user}`);
    if (!authLoading) { 
      if (activeSubTab === 'All' || activeSubTab === 'Most Viewed') {
        // For "All" and "Most Viewed", fetch data regardless of userProfile state,
        // as these are general content lists. Auth state (user?.uid) is passed for potential rule checks.
        fetchArticlesData(activeSubTab, userProfile, user?.uid);
      } else { // For "My Library", "Liked Articles"
        if (user && !isUserProfileLoading && userProfile) { // User is logged in AND profile is loaded
          fetchArticlesData(activeSubTab, userProfile, user.uid);
        } else if (user && isUserProfileLoading) { // User logged in, but profile is still loading
          console.log(`[ArticleContent Effect] User logged in, profile loading for tab ${activeSubTab}. Setting isLoading true.`);
          setIsLoading(true); setArticles([]); // Show loader until profile is ready
        } else if (!user) { // No user logged in
          console.log(`[ArticleContent Effect] No user for tab ${activeSubTab}. Setting isLoading false, clearing articles.`);
          setIsLoading(false); setArticles([]);
          setCurrentError(`Please sign in to view your ${activeSubTab.toLowerCase().replace(' articles', '')}.`);
        }
      }
    } else { // Auth is still loading
      console.log(`[ArticleContent Effect] Auth is loading. Setting isLoading true.`);
      setIsLoading(true); setArticles([]);
    }
  }, [authLoading, isUserProfileLoading, userProfile, user, activeSubTab, fetchArticlesData]);

  const handleToggleExpand = useCallback(async (articleIdToToggle: string) => {
    console.log("[ArticleContent] handleToggleExpand called for articleId:", articleIdToToggle);

    if (expandedArticleId === articleIdToToggle) { // User is clicking to collapse the currently expanded article
      console.log("[ArticleContent] Collapsing article:", articleIdToToggle);
      setExpandedArticleId(null);
      // Consumption is already marked on first successful expansion, no need to do anything here.
      return;
    }

    // User is clicking to expand a new article
    if (!user || !userProfile) {
      toast({ title: "Authentication Required", description: "Please sign in to read articles.", variant: "destructive" });
      return;
    }

    console.log("[ArticleContent] Attempting to expand article:", articleIdToToggle);
    // Deduct coins/use free tier immediately on first successful access grant
    const accessResult = await checkAndGrantContentAccess(articleIdToToggle, userProfile, user.uid);

    if (accessResult.canAccess) {
      console.log("[ArticleContent] Access granted for article:", articleIdToToggle, "Result:", accessResult);
      setExpandedArticleId(articleIdToToggle);
      if (accessResult.profileWasUpdated && refreshUserProfile) {
        console.log("[ArticleContent] User profile was updated, refreshing profile.");
        await refreshUserProfile(); // Refresh context to reflect new coin balance/consumption
      }
      if (accessResult.showLowBalanceWarning) {
        toast({
          title: "Low Balance Warning",
          description: `Your coin balance is now ${accessResult.newBalance}. Please top up soon!`,
          variant: "default",
          duration: 7000,
        });
      }
    } else {
      console.log("[ArticleContent] Access denied for article:", articleIdToToggle, "Message:", accessResult.message);
      toast({ title: "Access Denied", description: accessResult.message || "You do not have access to this content.", variant: "destructive" });
      setExpandedArticleId(null); // Ensure it doesn't expand if access is denied
    }
  }, [expandedArticleId, user, userProfile, toast, refreshUserProfile]);


  const handleRetry = () => {
    if (!authLoading) {
      fetchArticlesData(activeSubTab, userProfile, user?.uid);
    }
  };
  
  let articlesToDisplay = articles;
  if (expandedArticleId) {
    articlesToDisplay = articles.filter(article => article.id === expandedArticleId);
    if (articlesToDisplay.length === 0 && articles.length > 0 && !isLoading) {
      // This case might happen if the currently expanded article was filtered out from the main 'articles' list
      // (e.g., by a tab change). We should then collapse.
      console.warn(`[ArticleContent] Expanded article ${expandedArticleId} not found in current list for tab ${activeSubTab}. Collapsing.`);
      setExpandedArticleId(null);
      articlesToDisplay = articles; // Re-assign to the main list if we auto-collapse
    }
  }
  
  const getEmptyStateIcon = (tab: ArticlesSubTab) => {
    switch(tab) {
      case 'My Library': return LibraryLucideIcon;
      case 'Liked Articles': return Heart;
      default: return Newspaper;
    }
  };

  const emptyMessage = 
      activeSubTab === 'My Library' ? "You haven't saved any articles to your library." :
      activeSubTab === 'Liked Articles' ? "You haven't liked any articles yet." :
      activeSubTab === 'Most Viewed' ? "Most viewed articles will appear here soon." :
      "No articles found. New content is added regularly!";
      
  const renderContent = () => {
    if (isLoading && articlesToDisplay.length === 0 && !currentError) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground min-h-[calc(100vh-300px)]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                <p>Loading {activeSubTab.toLowerCase()} articles...</p>
            </div>
        );
    }

    if (currentError && articlesToDisplay.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-destructive px-4 text-center min-h-[calc(100vh-300px)]">
          <AlertTriangle className="h-10 w-10 mb-3" />
          <p className="text-xl font-semibold">Error Loading Articles</p>
          <p className="text-sm whitespace-pre-line">{currentError}</p>
          <Button onClick={handleRetry} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    if (articlesToDisplay.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center min-h-[calc(100vh-300px)] px-4">
            {React.createElement(getEmptyStateIcon(activeSubTab), { className: "mx-auto h-16 w-16 text-muted-foreground mb-4" })}
            <p className="text-xl text-muted-foreground font-semibold">{emptyMessage}</p>
            <p className="text-muted-foreground">Explore other sections or check back later!</p>
            {(activeSubTab === 'Liked Articles' || activeSubTab === 'My Library') && !user && (
                <p className="text-primary mt-2">Please sign in to see your {activeSubTab.toLowerCase().replace(' articles', '')}.</p>
            )}
            </div>
        );
    }

    return (
        <>
            {expandedArticleId && articlesToDisplay.length === 1 && (
                <div className="mt-6 mb-4 text-left px-4 md:px-0">
                <Button
                    variant="outline"
                    onClick={() => handleToggleExpand(expandedArticleId)} // Pass ID to toggle/collapse
                    className="text-foreground/90 hover:text-primary border-primary/50 hover:border-primary transition-colors py-2 px-4"
                >
                    Back to All Articles
                </Button>
                </div>
            )}
            <div className={`mt-4 space-y-8 ${expandedArticleId ? 'px-4 md:px-0' : 'md:grid md:grid-cols-2 md:gap-x-8 md:space-y-0 lg:grid-cols-3'}`}>
                {articlesToDisplay.map((article) => (
                <ArticleCard 
                    key={article.id} 
                    article={article}
                    isCurrentlyExpanded={expandedArticleId === article.id}
                    onToggleExpand={() => handleToggleExpand(article.id)}
                />
                ))}
            </div>
        </>
    );
  };

  return (
    <div className="container mx-auto px-0 md:px-4 py-0">
       <SubTabs
        tabs={subTabFilters}
        activeTab={activeSubTab}
        onTabChange={(tab) => {
          if (expandedArticleId) { // If an article is expanded, collapse it before switching tabs
            setExpandedArticleId(null);
          }
          setActiveSubTab(tab as ArticlesSubTab);
        }}
      />
      <div className="mt-2">
        {renderContent()}
      </div>
    </div>
  );
};

const ArticleContent: FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-10 min-h-[calc(100vh-200px)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ArticleContentInternal />
    </Suspense>
  );
}

export default ArticleContent;
