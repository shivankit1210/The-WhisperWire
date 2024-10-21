import { create } from 'zustand'
import { userStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user:null,
  IsCurrentUserBlocked:false,
  IsReceiverBlocked:false,
  changeChat:(chatId,user)=>{
    const currentUser = userStore.getState().currentUser

    // CHECK IF CURRENT USER IS BLOCKED
    
    if(user.blocked.includes(currentUser.id)){
      return set({
        chatId,
        user:null,
        IsCurrentUserBlocked:true,
        IsReceiverBlocked:false,
      })
    }

    // CHECK IF RECEIVER IS BLOCKED

    if(user.blocked.includes(currentUser.id)){
      return set({
        chatId,
        user:null,
        IsCurrentUserBlocked:false,
        IsReceiverBlocked:true,
      })
    }

  },
  changeBlock:()=>{
    set(state=>({...state,IsReceiverBlocked: !state.IsReceiverBlocked}))
  }


  
}))
