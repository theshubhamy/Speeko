import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '@/types';

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

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await signOut(auth);
}

// ─── Auth state listener ──────────────────────────────────────────────────────

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
