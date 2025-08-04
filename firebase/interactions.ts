
import { db } from './firebaseConfig';
import {
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';

export const toggleLike = async (postId: string, uid: string) => {
  const likeRef = doc(db, `posts/${postId}/likes`, uid);
  const snap = await getDoc(likeRef);
  if (snap.exists()) {
    await deleteDoc(likeRef);
  } else {
    await setDoc(likeRef, { userId: uid, createdAt: serverTimestamp() });
  }
};

export const addComment = async (postId: string, uid: string, text: string) => {
  await addDoc(collection(db, `posts/${postId}/comments`), {
    userId: uid,
    content: text,
    createdAt: serverTimestamp()
  });
};

export const followUser = async (myUid: string, targetUid: string) => {
  await setDoc(doc(db, `follows/${myUid}/following`, targetUid), {
    followedAt: serverTimestamp()
  });
  await setDoc(doc(db, `follows/${targetUid}/followers`, myUid), {
    followedAt: serverTimestamp()
  });
};

export const getComments = async (postId: string) => {
  const snapshot = await getDocs(collection(db, `posts/${postId}/comments`));
  return snapshot.docs.map(doc => doc.data());
};

export const getLikeCount = async (postId: string) => {
  const snapshot = await getDocs(collection(db, `posts/${postId}/likes`));
  return snapshot.size;
};
