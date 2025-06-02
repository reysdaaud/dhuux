// src/components/articles/ArticleCard.tsx
'use client';

import type { FC } from 'react';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ContentItem } from '@/services/contentService';
import { ArrowRight, Heart, Bookmark } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toggleLikeContent, toggleSaveContent } from '@/lib/userInteractions';
import { Timestamp } from 'firebase/firestore';
import '@/components/ui/articles.css'; // Import the custom CSS

interface ArticleCardProps {
  article: ContentItem;
  isCurrentlyExpanded: boolean;
  onToggleExpand: (articleId: string | null) => void;
}

const ArticleCard: FC<ArticleCardProps> = ({ article, isCurrentlyExpanded, onToggleExpand }) => {
  const { user, userProfile, refreshUserProfile, loading: authLoading, isUserProfileLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // console.log(`[ArticleCard] Rendering ${article.id}, expanded: ${isCurrentlyExpanded}`);
    // if (isCurrentlyExpanded) {
    //   console.log("[ArticleCard] Full body content for " + article.id + ":", article.fullBodyContent);
    // }
  }, [isCurrentlyExpanded, article.id, article.fullBodyContent]);
  
  let dateToFormat: Date | null = null;
  if (article.createdAt) {
    if (article.createdAt instanceof Timestamp) {
      dateToFormat = article.createdAt.toDate();
    } else if (typeof article.createdAt === 'string') {
      dateToFormat = parseISO(article.createdAt);
    } else if (typeof (article.createdAt as any)?.seconds === 'number') { 
      dateToFormat = new Timestamp((article.createdAt as any).seconds, (article.createdAt as any).nanoseconds).toDate();
    }
  }
  
  const formattedDate = dateToFormat && isValid(dateToFormat)
    ? format(dateToFormat, 'MMMM dd, yyyy')
    : 'Date unavailable';

  const metaInfo = `${article.category || 'Article'} | ${formattedDate}`;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !userProfile) {
      toast({ title: "Login Required", description: "Please login to like articles.", variant: "destructive" });
      return;
    }
    try {
      const wasLiked = userProfile.likedContentIds?.includes(article.id);
      await toggleLikeContent(user.uid, article.id);
      if (refreshUserProfile) await refreshUserProfile();
      toast({ title: "Success", description: wasLiked ? "Removed from Liked Articles." : "Added to Liked Articles." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update like status.", variant: "destructive" });
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !userProfile) {
      toast({ title: "Login Required", description: "Please login to save articles.", variant: "destructive" });
      return;
    }
    try {
      const wasSaved = userProfile.savedContentIds?.includes(article.id);
      await toggleSaveContent(user.uid, article.id);
      if (refreshUserProfile) await refreshUserProfile();
      toast({ title: "Success", description: wasSaved ? "Removed from My Library." : "Added to My Library." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update save status.", variant: "destructive" });
    }
  };

  const isLiked = userProfile?.likedContentIds?.includes(article.id) ?? false;
  const isSaved = userProfile?.savedContentIds?.includes(article.id) ?? false;

  const handleToggle = () => {
    onToggleExpand(isCurrentlyExpanded ? null : article.id);
  };

  return (
    <Card className="w-full bg-transparent border-none shadow-none rounded-none mb-8 break-inside-avoid-column">
      {article.imageUrl && !isCurrentlyExpanded && ( // Only show image in card view if not expanded
        <div 
          className="relative w-full aspect-[16/9] overflow-hidden mb-3 rounded-md cursor-pointer group"
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
        >
          <Image
            src={article.imageUrl}
            alt={article.title || 'Article image'}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={article.dataAiHint || "article image"}
          />
        </div>
      )}
      <CardContent className="p-0">
        {!isCurrentlyExpanded && (
          <>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{metaInfo}</p>
            <CardTitle
                className="text-xl lg:text-2xl font-bold text-foreground mb-2 leading-tight hover:text-primary transition-colors cursor-pointer"
                onClick={handleToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
            >
              {article.title}
            </CardTitle>
            {article.excerpt && (
              <p className="text-sm text-foreground/80 line-clamp-3 mt-2 mb-3">
                {article.excerpt}
              </p>
            )}
          </>
        )}

        {isCurrentlyExpanded && article.fullBodyContent && (
          <div className="ArticleBody_root__2gF81"> {/* Root class for custom article styling */}
            {/* Featured image at the top of the expanded view if needed, assuming articles.css handles its styling */}
            {article.imageUrl && (
                 <div className="relative w-full aspect-[16/9] overflow-hidden mb-4"> {/* Adjust class if articles.css has specific figure styling */}
                    <Image
                        src={article.imageUrl}
                        alt={article.title || 'Article image'}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={article.dataAiHint || "article image"}
                    />
                </div>
            )}
            {/* Title for expanded view, assuming articles.css styles h1 or a specific title class within ArticleBody_root__2gF81 */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <div className="ArticleBooksModule_creator__kmwjl mb-4">
                By {article.subtitle}
              </div>
            )}
            {article.fullBodyContent.split(/\n\s*\n|\n{2,}/).map((paragraphBlock, pIndex) => (
              <p 
                key={pIndex} 
                className={`ArticleParagraph_root__4mszW ${pIndex === 0 ? 'ArticleParagraph_dropcap__uIVzg' : ''}`}
              >
                {paragraphBlock.split('\n').map((line, lIndex, linesArray) => (
                  <React.Fragment key={lIndex}>
                    {line}
                    {lIndex < linesArray.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        )}
        
        <div className="mt-3 flex items-center space-x-1">
            {(!isCurrentlyExpanded && (article.excerpt || article.fullBodyContent)) && (
                <Button
                variant="outline"
                className="p-2 text-foreground/90 hover:text-primary transition-colors text-sm flex items-center border-primary/50 hover:border-primary h-auto" 
                onClick={handleToggle}
                aria-expanded={isCurrentlyExpanded}
                >
                Read More
                <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
            )}
            {user && (
              <>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary p-1 h-auto w-auto" onClick={handleLike} aria-label={isLiked ? "Unlike article" : "Like article"} disabled={authLoading || isUserProfileLoading}>
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary p-1 h-auto w-auto" onClick={handleSave} aria-label={isSaved ? "Unsave article" : "Save article"} disabled={authLoading || isUserProfileLoading}>
                    <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ArticleCard;

