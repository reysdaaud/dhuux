// src/services/contentService.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  where,
  QueryConstraint,
  Query,
  DocumentData,
  limit,
  startAfter,
  DocumentSnapshot
, getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ContentItem {
  id: string;
  title: string;
  subtitle?: string; // Artist for audio, author/source for articles
  imageUrl: string;
  dataAiHint: string;
  category?: string; // e.g., Music, Podcast, News, Tech
  contentType: 'audio' | 'article'; // Explicit content type
  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  // Audio specific
  audioSrc?: string; // URL to audio file

  // Article specific
  excerpt?: string; // Short summary
  fullBodyContent?: string; // Full HTML or Markdown content

  // Series/Episode specific
  isSeries?: boolean;      // Is this content item a parent series?
  parentId?: string;       // If an episode, ID of the parent series
  episodeNumber?: number;  // If an episode, its number in the series
  seasonNumber?: number;   // If an episode, its season number
  seriesTitle?: string;    // Denormalized title of the parent series for easy display
}

export interface ContentItemData extends Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> {
  // Ensure optional fields can be explicitly set to null if needed to remove them during an update
  subtitle?: string | null;
  audioSrc?: string | null;
  excerpt?: string | null;
  fullBodyContent?: string | null;
  isSeries?: boolean | null;
  parentId?: string | null;
  episodeNumber?: number | null;
  seasonNumber?: number | null;
  seriesTitle?: string | null;
}


const CONTENT_COLLECTION = 'content';
const CATEGORIES_COLLECTION = 'categories';

// Helper to remove undefined fields from data before sending to Firestore
const prepareDataForFirestore = <T extends Record<string, any>>(data: T): Partial<T> => {
  const firestoreData: Partial<T> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
      firestoreData[key as keyof T] = data[key];
    }
  }
  return firestoreData;
};


export const getContentItems = async (queryConstraints: QueryConstraint[] = [], lastVisible?: DocumentSnapshot<DocumentData> | null, pageSize: number = 20): Promise<{items: ContentItem[], newLastVisible: DocumentSnapshot<DocumentData> | null }> => {
  try {
    const contentCollectionRef = collection(db, CONTENT_COLLECTION);
    
    const finalConstraints: QueryConstraint[] = [...queryConstraints];
    const hasOrderBy = queryConstraints.some(c => (c as any)._field === 'createdAt'); // Basic check
    if (!hasOrderBy) {
        finalConstraints.push(orderBy('createdAt', 'desc'));
    }
    finalConstraints.push(limit(pageSize));

    if (lastVisible) {
        finalConstraints.push(startAfter(lastVisible));
    }
    
    const q = query(contentCollectionRef, ...finalConstraints);
    const querySnapshot = await getDocs(q);
    
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ContentItem));

    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { items, newLastVisible };

  } catch (error) {
    console.error('Error fetching content items:', error);
    throw error;
  }
};

export const getSeriesItems = async (): Promise<ContentItem[]> => {
  try {
    const q = query(
      collection(db, CONTENT_COLLECTION),
      where('isSeries', '==', true),
      orderBy('title'), // Order by title for display
      limit(100) // Example limit, adjust as needed
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
  } catch (error) {
    console.error('Error fetching series items:', error);
    throw error;
  }
};

export const addCategory = async (name: string): Promise<string> => {
  try {
    const categoriesCollectionRef = collection(db, CATEGORIES_COLLECTION);
    const categoryDocRef = await addDoc(categoriesCollectionRef, { name });
    return categoryDocRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const categoriesCollectionRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesCollectionRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().name as string);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const deleteCategory = async (name: string): Promise<void> => {
  try {
    const categoriesCollectionRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesCollectionRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming category names are unique, delete the first matching document
      const categoryDocRef = doc(db, CATEGORIES_COLLECTION, querySnapshot.docs[0].id);
      await deleteDoc(categoryDocRef);
    } else {
      console.warn(`Category with name "${name}" not found.`);
    }
  } catch (error) {
    console.error(`Error deleting category "${name}":`, error);
    throw error;
  }
};

export const getContentItemsByCategory = async (categoryName: string): Promise<ContentItem[]> => {
  try {
    // Optional: Check if the category exists in the categories collection
    const categories = await getCategories();
    if (!categories.includes(categoryName)) {
        console.warn(`Category "${categoryName}" does not exist.`);
        // Optionally throw an error or return an empty array
        return [];
    }
    const q = query(
 collection(db, CONTENT_COLLECTION),
 where('category', '==', categoryName),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
  } catch (error) {
    console.error(`Error fetching content items for category ${categoryName}:`, error);
    throw error;
  }
};


export const getSeriesEpisodes = async (seriesId: string): Promise<ContentItem[]> => {
  try {
    const q = query(
      collection(db, CONTENT_COLLECTION),
      where('parentId', '==', seriesId),
      orderBy('seasonNumber', 'asc'), // Order by season
      orderBy('episodeNumber', 'asc') // Then order by episode number
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContentItem));
  } catch (error) {
    console.error(`Error fetching episodes for series ${seriesId}:`, error);
    throw error;
  }
};

export const addContentItem = async (itemData: ContentItemData): Promise<string> => {
  try {
    const { category, isSeries, parentId, episodeNumber, seasonNumber, ...rest } = itemData;

    // Validate category if provided
    if (category) {
      const categories = await getCategories();
      if (!categories.includes(category)) {
        throw new Error(`Invalid category: "${category}". Category does not exist.`);
      }
    }

    const preparedData = prepareDataForFirestore(itemData);

    if (isSeries) {
      // If adding a series, clear episode-specific fields
      preparedData.isSeries = true; // Ensure it's explicitly true
      delete preparedData.parentId;
      delete preparedData.episodeNumber;
      delete preparedData.seasonNumber;
      delete preparedData.seriesTitle;
    } else {
      // If adding an episode, parentId and seriesTitle are required
      if (!parentId || !rest.seriesTitle) {
        throw new Error('Episode must have a parentId and seriesTitle.');
      }
      preparedData.isSeries = false; // Ensure it's explicitly false
      preparedData.parentId = parentId;
        delete preparedData.parentId;
        delete preparedData.episodeNumber;
        delete preparedData.seriesTitle;
    }
    const dataToSave = {
      ...preparedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

      // Ensure episodeNumber and seasonNumber are numbers if provided as strings
    if (dataToSave.episodeNumber === '' || dataToSave.episodeNumber === null || typeof dataToSave.episodeNumber === 'undefined') {
      delete dataToSave.episodeNumber;
    } else if (typeof dataToSave.episodeNumber === 'string') {
      dataToSave.episodeNumber = parseInt(dataToSave.episodeNumber, 10);
      if (isNaN(dataToSave.episodeNumber)) delete dataToSave.episodeNumber; // Remove if parsing fails
    }

    if (dataToSave.seasonNumber === '' || dataToSave.seasonNumber === null || typeof dataToSave.seasonNumber === 'undefined') {
      delete dataToSave.seasonNumber;
    } else if (typeof dataToSave.seasonNumber === 'string') {
      dataToSave.seasonNumber = parseInt(dataToSave.seasonNumber, 10);
      if (isNaN(dataToSave.episodeNumber)) delete dataToSave.episodeNumber;
    }

    const docRef = await addDoc(collection(db, CONTENT_COLLECTION), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error adding content item:', error);
    throw error;
  }
};

export const updateContentItem = async (itemId: string, itemData: Partial<ContentItemData>): Promise<void> => {
  try {
    const currentItemDoc = await getDoc(doc(db, CONTENT_COLLECTION, itemId));
    if (!currentItemDoc.exists()) {
      throw new Error(`Content item with ID "${itemId}" not found.`);
    }
    const currentItem = currentItemDoc.data() as ContentItem;

    const dataToUpdate: Record<string, any> = {
      ...prepareDataForFirestore(itemData),
      updatedAt: Timestamp.now(),
    };

    // Validate category if provided
    if (dataToUpdate.category !== undefined && dataToUpdate.category !== null) {
      const categories = await getCategories();
      if (!categories.includes(dataToUpdate.category)) {
        throw new Error(`Invalid category: "${dataToUpdate.category}". Category does not exist.`);
      }
    }

    // Handle isSeries transition and episode data
    if (dataToUpdate.isSeries === true) {
      // Updating to be a series, clear episode fields
      dataToUpdate.parentId = null;
      dataToUpdate.episodeNumber = null;
      dataToUpdate.seasonNumber = null;
      dataToUpdate.seriesTitle = null;
    } else if (dataToUpdate.isSeries === false) {
      // Updating to be an episode, require parentId and seriesTitle (or use existing)
      const finalParentId = dataToUpdate.parentId !== undefined ? dataToUpdate.parentId : currentItem.parentId;
      const finalSeriesTitle = dataToUpdate.seriesTitle !== undefined ? dataToUpdate.seriesTitle : currentItem.seriesTitle;

      if (!finalParentId || !finalSeriesTitle) {
         throw new Error('Episode must have a parentId and seriesTitle.');
      }
      dataToUpdate.parentId = finalParentId;
      dataToUpdate.seriesTitle = finalSeriesTitle;
      // seasonNumber and episodeNumber are optional and handled below
    }

    if (dataToUpdate.episodeNumber === '' || dataToUpdate.episodeNumber === null || typeof dataToUpdate.episodeNumber === 'undefined') {
       // If explicitly set to null, allow it to remove the field or set to null
       // For Firestore, to remove a field, you'd use FieldValue.delete()
       dataToUpdate.episodeNumber = null;
    }

    if (dataToUpdate.seasonNumber === '' || dataToUpdate.seasonNumber === null || typeof dataToUpdate.seasonNumber === 'undefined') {
       // If explicitly set to null, allow it to remove the field or set to null
       dataToUpdate.seasonNumber = null;
    }

    // Don't allow updating createdAt
    if ('createdAt' in dataToUpdate) {
        delete dataToUpdate.createdAt;
    }

    const itemDocRef = doc(db, CONTENT_COLLECTION, itemId);
    await updateDoc(itemDocRef, dataToUpdate);
  } catch (error) {
    console.error('Error updating content item:', error);
    throw error;
  }
};

export const deleteContentItem = async (itemId: string): Promise<void> => {
  try {
    const itemDocRef = doc(db, CONTENT_COLLECTION, itemId);
    await deleteDoc(itemDocRef);
  } catch (error) {
    console.error('Error deleting content item:', error);
    throw error;
  }
};
