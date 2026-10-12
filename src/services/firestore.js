import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// DESTINATIONS - By Sumit Kumar Prusty

export const saveDestination = async (userId, destination) => {
  try {
    const docRef = await addDoc(
      collection(db, 'users', userId, 'destinations'),
      {
        ...destination,
        savedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('Error saving destination:', error);
    throw error;
  }
};

export const getUserDestinations = async (userId) => {
  try {
    const snapshot = await getDocs(
      collection(db, 'users', userId, 'destinations')
    );
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

export const updateDestination = async (userId, destinationId, updates) => {
  try {
    const docRef = doc(db, 'users', userId, 'destinations', destinationId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    throw error;
  }
};

export const deleteDestination = async (userId, destinationId) => {
  try {
    const docRef = doc(db, 'users', userId, 'destinations', destinationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting destination:', error);
    throw error;
  }
};

// BUDGETS - By Sasanka Sekhar Malla

export const saveBudget = async (userId, budget) => {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'budgets'), {
      ...budget,
      savedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving budget:', error);
    throw error;
  }
};

export const getUserBudgets = async (userId) => {
  try {
    const snapshot = await getDocs(
      collection(db, 'users', userId, 'budgets')
    );
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }
};

export const updateBudget = async (userId, budgetId, updates) => {
  try {
    const docRef = doc(db, 'users', userId, 'budgets', budgetId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};

export const deleteBudget = async (userId, budgetId) => {
  try {
    const docRef = doc(db, 'users', userId, 'budgets', budgetId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
};

// USER PROFILE - By Sumit Kumar Prusty

export const initializeUserProfile = async (userId, userData = {}) => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      email: userData.email || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: userId };
  } catch (error) {
    console.error('Error initializing user profile:', error);
    throw error;
  }
};

export const saveUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// SYNC ALL USER DATA

export const syncAllUserData = async (userId) => {
  try {
    const [destinations, budgets] = await Promise.all([
      getUserDestinations(userId),
      getUserBudgets(userId),
    ]);

    return {
      destinations,
      budgets,
    };
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw error;
  }
};
