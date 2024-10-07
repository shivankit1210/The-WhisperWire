import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';

export const userStore = create((set) => ({
  currentUser: null,
  IsLoading: true,
  fetchUserInfo: async (uid)=>{
    if(!uid) return set({currentUser:null,IsLoading:false});

    try {
        const docRef = doc(db,"users",uid)
        const docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            set({currentUser:docSnap.data(),IsLoading:false});
        }
        else{
          set({currentUser:null,IsLoading:false});

        }
    } catch (error) {
        console.log(error);
        return set({currentUser:null,IsLoading:false});

    }
  }
}))
