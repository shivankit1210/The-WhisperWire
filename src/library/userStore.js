import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const userStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid, callback) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
        if (callback) callback(docSnap.data());
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.log(error);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
