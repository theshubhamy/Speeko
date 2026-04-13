import { User } from '@/types';
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// ─── Map Firebase user → App user ────────────────────────────────────────────

export async function getAppUser(firebaseUser: FirebaseUser): Promise<User | null> {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as User;
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);

  // Set display name
  await updateProfile(fbUser, { displayName: name });

  // Create Firestore user doc
  const newUser: User = {
    id: fbUser.uid,
    name,
    email,
    plan: 'free',
    createdAt: Date.now(),
    totalSessions: 0,
    averageScore: 0,
    streak: 0,
  };

  await setDoc(doc(db, 'users', fbUser.uid), {
    ...newUser,
    createdAt: serverTimestamp(),
  });

  return newUser;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password);

  const appUser = await getAppUser(fbUser);
  if (!appUser) throw new Error('User profile not found. Please re-register.');

  return appUser;
}


// ─── Guest Login ──────────────────────────────────────────────────────────────

export async function loginAsGuest(): Promise<User> {
  const { user: fbUser } = await signInAnonymously(auth);

  const guestName = `Guest_${fbUser.uid.slice(0, 5)}`;

  const guestUser: User = {
    id: fbUser.uid,
    name: guestName,
    email: '',
    plan: 'free',
    createdAt: Date.now(),
    totalSessions: 0,
    averageScore: 0,
    streak: 0,
  };

  await setDoc(doc(db, 'users', fbUser.uid), {
    ...guestUser,
    createdAt: serverTimestamp(),
  });

  return guestUser;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await signOut(auth);
}

// ─── Update Profile ───────────────────────────────────────────────────────────

export async function updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
  const fbUser = auth.currentUser;
  
  // Update Firebase Auth if name or avatar is changed
  if (fbUser && (updates.name || updates.avatar)) {
    await updateProfile(fbUser, {
      displayName: updates.name || fbUser.displayName,
      photoURL: updates.avatar || fbUser.photoURL,
    });
  }

  // Update Firestore
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, updates);
}

// ─── Auth state listener ──────────────────────────────────────────────────────

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
