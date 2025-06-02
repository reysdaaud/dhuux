// src/components/sounds/SoundsContent.tsx
'use client';

import type { FC } from 'react';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { collection, getDocs, query, where, orderBy, QueryConstraint, Timestamp, limit, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AudioCard from './AudioCard';
import FeaturedAudioCard from './FeaturedAudioCard';
import SubTabs from '@/components/shared/SubTabs';
import { Loader2, AlertTriangle, Music, Podcast as PodcastIcon, ListMusic, Heart, Library as LibraryLucideIcon } from 'lucide-react';
import type { ContentItem } from '@/services/contentService';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import LikedSongsHeader from './LikedSongsHeader'; 
import LikedSongItemRow from './LikedSongItemRow'; 
import LibraryCard from '@/components/library/LibraryCard'; // For browse views
import TopListItemCard from '@/components/library/TopListItemCard'; // For "Good afternoon"


interface CardSectionProps {
  title: string;
  items: ContentItem[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ElementType;
  onRetry?: () => void;
  currentTab?: SoundsSubTab;
  useSimpleCard?: boolean; // To use LibraryCard for browse views
  hideSectionTitle?: boolean;
}

const CardSection: FC<CardSectionProps> = ({ title, items, isLoading, emptyMessage, emptyIcon: EmptyIcon, onRetry, currentTab, useSimpleCard = false, hideSectionTitle = false }) => {
  const { user } = useAuth();

  if (isLoading) {
     return (
      <section className="py-4">
        {!hideSectionTitle && <h2 className="text-2xl font-bold text-foreground mb-3 px-4 md:px-0">{title}</h2>}
        <div className="px-4 md:px-0 flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading {title.toLowerCase()}...</span>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    let finalEmptyMessage = emptyMessage || `No items found in ${title.toLowerCase()} yet.`;
    if (!user && (currentTab === 'My Library' || currentTab === 'Liked Songs')) {
        finalEmptyMessage = `Please sign in to see your ${title.toLowerCase()}.`;
    }
    return (
       <section className="py-4">
        {!hideSectionTitle && <h2 className="text-2xl font-bold text-foreground mb-3 px-4 md:px-0">{title}</h2>}
        <div className="flex flex-col items-center justify-center py-10 text-center min-h-[150px] text-muted-foreground">
          {EmptyIcon && <EmptyIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />}
          <p className="text-lg">{finalEmptyMessage}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="mt-4">
              Retry
            </Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      {!hideSectionTitle && <h2 className="text-2xl font-bold text-foreground mb-3 px-4 md:px-0">{title}</h2>}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4 px-4 md:px-0">
          {items.map((item) => (
            useSimpleCard ? (
              <LibraryCard // Use simpler LibraryCard for browse views
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                imageUrl={item.imageUrl}
                audioSrc={item.audioSrc}
                dataAiHint={item.dataAiHint}
              />
            ) : (
              <AudioCard // Use AudioCard (with like/save) for My Library / Liked Songs
                key={item.id}
                audioItem={item}
              />
            )
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

type SoundsSubTab = 'All' | 'Music' | 'Podcasts' | 'My Library' | 'Liked Songs';

const SoundsContentInternal: FC = () => {
  const { user, userProfile, loading: authLoading, isUserProfileLoading } = useAuth();
  const { setCurrentTrack, currentTrack, isPlaying: isPlayerPlaying } = usePlayer();
  const [activeSubTab, setActiveSubTab] = useState<SoundsSubTab>('All');
  const subTabFilters: SoundsSubTab[] = ['All', 'Music', 'Podcasts', 'My Library', 'Liked Songs'];

  const [content, setContent] = useState<ContentItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<ContentItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentError, setCurrentError] = useState<string | null>(null);

  const fetchAudioContent = useCallback(async (
    tab: SoundsSubTab,
    profileForQuery: typeof userProfile | null,
    currentUserId?: string
  ) => {
    console.log(`[SoundsContent] Fetching audio. Tab: ${tab}, UserID: ${currentUserId}, Profile loaded: ${!!profileForQuery}`);
    setIsLoading(true);
    setCurrentError(null);
    setContent([]);
    setFeaturedItems([]); 
    let fetchedItems: ContentItem[] = [];
    let shouldFetchFromFirestore = true;
    
    try {
      const contentCollectionRef = collection(db, 'content');
      let queryConstraints: QueryConstraint[] = [where('contentType', '==', 'audio')];

      switch (tab) {
        case 'Music':
          queryConstraints.push(where('category', '==', 'Music'));
          break;
        case 'Podcasts':
          queryConstraints.push(where('category', '==', 'Podcast'));
          break;
        case 'My Library':
          if (currentUserId && profileForQuery?.savedContentIds && profileForQuery.savedContentIds.length > 0) {
            const savedIds = profileForQuery.savedContentIds;
            console.log(`[SoundsContent] Fetching "My Library" for user ${currentUserId}, saved IDs:`, savedIds);
            const chunks = []; for (let i = 0; i < savedIds.length; i += 30) { chunks.push(savedIds.slice(i, i + 30)); }
            for (const chunk of chunks) {
              if (chunk.length > 0) {
                const chunkQuery = query(contentCollectionRef, where(documentId(), 'in', chunk), where('contentType', '==', 'audio'));
                const querySnapshot = await getDocs(chunkQuery);
                fetchedItems.push(...querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem)));
              }
            }
          } else { 
            console.log(`[SoundsContent] "My Library" tab: No user/profile or no saved IDs. Skipping Firestore fetch.`);
            shouldFetchFromFirestore = false; 
          }
          break;
        case 'Liked Songs':
          if (currentUserId && profileForQuery?.likedContentIds && profileForQuery.likedContentIds.length > 0) {
            const likedIds = profileForQuery.likedContentIds;
            console.log(`[SoundsContent] Fetching "Liked Songs" for user ${currentUserId}, liked IDs:`, likedIds);
            const chunks = []; for (let i = 0; i < likedIds.length; i += 30) { chunks.push(likedIds.slice(i, i + 30)); }
            for (const chunk of chunks) {
              if (chunk.length > 0) {
                const chunkQuery = query(contentCollectionRef, where(documentId(), 'in', chunk), where('contentType', '==', 'audio'));
                const querySnapshot = await getDocs(chunkQuery);
                fetchedItems.push(...querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem)));
              }
            }
          } else { 
            console.log(`[SoundsContent] "Liked Songs" tab: No user/profile or no liked IDs. Skipping Firestore fetch.`);
            shouldFetchFromFirestore = false; 
          }
          break;
        case 'All':
        default:
          console.log(`[SoundsContent] Fetching "All" audio content.`);
          // No additional specific filters for 'All' other than contentType audio
          break;
      }
      
      if (shouldFetchFromFirestore && (tab === 'All' || tab === 'Music' || tab === 'Podcasts')) {
        queryConstraints.push(orderBy('createdAt', 'desc')); 
        queryConstraints.push(limit(20)); 
        const contentQuery = query(contentCollectionRef, ...queryConstraints);
        const querySnapshot = await getDocs(contentQuery);
        fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
      }
      
      console.log(`[SoundsContent] Raw fetched items from Firestore for tab "${tab}": ${fetchedItems.length}`);
      
      let validItems = fetchedItems
        .filter(item => item.contentType === 'audio' && item.audioSrc && item.audioSrc.trim() !== '' && item.title && item.imageUrl && item.dataAiHint)
        .map(item => ({
            ...item,
            createdAt: item.createdAt instanceof Timestamp ? item.createdAt 
                       : (item.createdAt && typeof (item.createdAt as any).seconds === 'number') 
                         ? new Timestamp((item.createdAt as any).seconds, (item.createdAt as any).nanoseconds) 
                         : undefined,
        }));
      
      console.log(`[SoundsContent] Processed ${validItems.length} valid audio items for tab "${tab}" after client-side validation.`);
      
      // Content is no longer hidden if consumed for "All", "Music", "Podcasts" tabs.
      setContent(validItems);

      if ((tab === 'All' || tab === 'Music' || tab === 'Podcasts') && validItems.length > 0) {
        setFeaturedItems(validItems.slice(0, Math.min(validItems.length, 6))); // Used for "Good afternoon" section
      } else {
        setFeaturedItems([]); 
      }

    } catch (err: any) {
      console.error(`[SoundsContent] Error fetching sounds for tab ${tab}:`, err);
      const indexNeeded = err.code === 'failed-precondition';
      const specificErrorMsg = indexNeeded
        ? `Firestore query requires an index. Check console for link. Error: ${err.message}`
        : `Failed to load sounds for ${tab}. Error: ${err.message}`;
      setCurrentError(specificErrorMsg);
      setContent([]);
      setFeaturedItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

 useEffect(() => {
    console.log(`[SoundsContent Effect] Triggering fetch. ActiveTab: ${activeSubTab}, AuthLoading: ${authLoading}, UserProfileLoading: ${isUserProfileLoading}, User: ${!!user}`);
    if (!authLoading) { 
      if (activeSubTab === 'All' || activeSubTab === 'Music' || activeSubTab === 'Podcasts') {
        fetchAudioContent(activeSubTab, userProfile, user?.uid);
      } else { 
        if (user && !isUserProfileLoading && userProfile) { 
          fetchAudioContent(activeSubTab, userProfile, user.uid);
        } else if (user && isUserProfileLoading) { 
          console.log(`[SoundsContent Effect] User logged in, profile loading for tab ${activeSubTab}. Setting isLoading true.`);
          setIsLoading(true); setContent([]); setFeaturedItems([]);
        } else if (!user) { 
          console.log(`[SoundsContent Effect] No user for tab ${activeSubTab}. Setting isLoading false, clearing content.`);
          setIsLoading(false); setContent([]); setFeaturedItems([]);
          setCurrentError(`Please sign in to see your ${activeSubTab.toLowerCase().replace(' songs', '')}.`);
        }
      }
    } else { 
      console.log(`[SoundsContent Effect] Auth is loading. Setting isLoading true.`);
      setIsLoading(true); setContent([]); setFeaturedItems([]);
    }
  }, [authLoading, isUserProfileLoading, userProfile, user, activeSubTab, fetchAudioContent]);

  const getEmptyStateIcon = (tab: SoundsSubTab) => {
    switch(tab) {
      case 'Music': return Music;
      case 'Podcasts': return PodcastIcon;
      case 'My Library': return LibraryLucideIcon;
      case 'Liked Songs': return Heart;
      default: return ListMusic;
    }
  };

  const handleRetry = () => {
    if (!authLoading) {
      fetchAudioContent(activeSubTab, userProfile, user?.uid);
    }
  };

  const handlePlayTrack = (track: ContentItem) => {
    // Access check is now handled by PlayerContext when setCurrentTrack is called
    if (track.audioSrc) {
      setCurrentTrack({
        id: track.id,
        title: track.title,
        artist: track.subtitle,
        imageUrl: track.imageUrl,
        audioSrc: track.audioSrc,
        dataAiHint: track.dataAiHint,
      });
    }
  };
  
  const renderTabContent = () => {
    if (isLoading && content.length === 0 && featuredItems.length === 0 && !currentError) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground min-h-[calc(100vh-300px)]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                <p>Loading {activeSubTab.toLowerCase()}...</p>
            </div>
        );
    }

    if (currentError && content.length === 0 && featuredItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-destructive px-4 text-center min-h-[calc(100vh-300px)]">
          <AlertTriangle className="h-10 w-10 mb-3" />
          <p className="text-xl font-semibold">Error Loading Sounds</p>
          <p className="text-sm whitespace-pre-line">{currentError}</p>
          <Button onClick={handleRetry} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    if (activeSubTab === 'Liked Songs') {
      if (!user && !authLoading && !isUserProfileLoading) { // Check specifically for no user after loading states are done
        return <div className="text-center py-10 text-muted-foreground px-4"><Heart className="mx-auto h-12 w-12 text-muted-foreground mb-3" /><p className="text-lg">Please sign in to see your liked songs.</p></div>;
      }
      if (content.length === 0 && !isLoading) { // No liked songs and not loading
        return <div className="text-center py-10 text-muted-foreground px-4"><Heart className="mx-auto h-12 w-12 text-muted-foreground mb-3" /><p className="text-lg">You haven't liked any songs yet.</p></div>;
      }
      return (
        <div className="pb-16"> {/* Add padding for player bar */}
          <LikedSongsHeader likedItems={content} onPlayAll={() => content.length > 0 && handlePlayTrack(content[0])} />
          <div className="px-2 md:px-4 mt-4 space-y-1">
            {content.map((item, index) => (
              <LikedSongItemRow
                key={item.id}
                track={item}
                itemIndex={index}
                onPlay={() => handlePlayTrack(item)}
                isCurrentPlaying={currentTrack?.id === item.id}
                isPlayerActuallyPlaying={isPlayerPlaying}
              />
            ))}
          </div>
        </div>
      );
    }
    
    const itemsToDisplay = content;
    let sectionTitle = activeSubTab === 'All' ? 'All Sounds' : activeSubTab;
    if (activeSubTab === 'Music') sectionTitle = 'Music';
    if (activeSubTab === 'Podcasts') sectionTitle = 'Podcasts';
    let specificEmptyMessage = `No items found in ${sectionTitle.toLowerCase()} yet.`;
    
    const useSimpleBrowseCard = activeSubTab === 'All' || activeSubTab === 'Music' || activeSubTab === 'Podcasts';
    const hideMainSectionTitle = activeSubTab === 'My Library' || activeSubTab === 'Liked Songs';

    if (activeSubTab === 'My Library') {
        sectionTitle = "My Library";
        specificEmptyMessage = "You haven't saved any sounds to your library.";
        if (!user && !authLoading && !isUserProfileLoading) {
            return <div className="text-center py-10 text-muted-foreground px-4"><LibraryLucideIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" /><p className="text-lg">Please sign in to see your library.</p></div>;
        }
        if (itemsToDisplay.length === 0 && !isLoading) {
             return <div className="text-center py-10 text-muted-foreground px-4"><LibraryLucideIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" /><p className="text-lg">{specificEmptyMessage}</p></div>;
        }
    }
    
    // For "All", "Music", "Podcasts" - general browse views
    if ((activeSubTab === 'All' || activeSubTab === 'Music' || activeSubTab === 'Podcasts') && itemsToDisplay.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center min-h-[calc(100vh-300px)] text-muted-foreground px-4">
            {React.createElement(getEmptyStateIcon(activeSubTab), { className: "mx-auto h-12 w-12 text-muted-foreground mb-3" })}
            <p className="text-lg">{specificEmptyMessage}</p>
            </div>
        );
    }


    return (
      <>
        {(activeSubTab === 'All' || activeSubTab === 'Music' || activeSubTab === 'Podcasts') && !isLoading && featuredItems.length > 0 && (
          <section className="pt-4 px-4 md:px-0">
            <h2 className="text-xl font-bold text-foreground mb-3">Good afternoon</h2>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {featuredItems.map((item) => ( 
                <TopListItemCard // Using TopListItemCard for the "Good afternoon" section
                  key={item.id} 
                  id={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  imageUrl={item.imageUrl}
                  audioSrc={item.audioSrc}
                  dataAiHint={item.dataAiHint}
                  artist={item.subtitle} // Pass subtitle as artist
                /> 
              ))}
            </div>
          </section>
        )}
        <CardSection 
            title={sectionTitle} 
            items={itemsToDisplay.filter(item => !featuredItems.find(f => f.id === item.id))} 
            isLoading={isLoading && itemsToDisplay.length === 0 && !(featuredItems.length > 0 && (activeSubTab === 'All' || activeSubTab === 'Music' || activeSubTab === 'Podcasts'))}
            emptyMessage={specificEmptyMessage} 
            emptyIcon={getEmptyStateIcon(activeSubTab)}
            onRetry={handleRetry}
            currentTab={activeSubTab}
            useSimpleCard={useSimpleBrowseCard} 
            hideSectionTitle={hideMainSectionTitle || (activeSubTab === 'All' && featuredItems.length > 0)} // Hide 'All Sounds' if featured section is shown
        />
         {/* Example of additional sections for "All", "Music", "Podcasts" */}
        {(activeSubTab === 'All' || activeSubTab === 'Music' || activeSubTab === 'Podcasts') && itemsToDisplay.length > 6 && (
            <CardSection
                title="More of what you like"
                items={itemsToDisplay.slice(6, Math.min(itemsToDisplay.length, 12))} // Example slice
                useSimpleCard={true}
                isLoading={isLoading}
             />
        )}
      </>
    );
  };

  return (
    <div className="text-foreground pb-12">
       <SubTabs
        tabs={subTabFilters}
        activeTab={activeSubTab}
        onTabChange={(tab) => setActiveSubTab(tab as SoundsSubTab)}
        className="px-4 md:px-0" 
      />
      <div className="mt-2">
        {renderTabContent()}
      </div>
    </div>
  );
};

const SoundsContent: FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-10 min-h-[calc(100vh-200px)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SoundsContentInternal />
    </Suspense>
  );
}

export default SoundsContent;
