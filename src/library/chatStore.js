// import { create } from "zustand";
// import { userStore } from "./userStore";

// export const useChatStore = create((set) => ({
//   chatId: null,
//   user: null,
//   IsCurrentUserBlocked: false,
//   IsReceiverBlocked: false,
//   changeChat: (chatId, user) => {
//     const currentUser = userStore.getState().currentUser;

//     // CHECK IF CURRENT USER IS BLOCKED

//     if (user.blocked.includes(currentUser.id)) {
//       return set({
//         chatId,
//         user: null,
//         IsCurrentUserBlocked: true,
//         IsReceiverBlocked: false,
//       });
//     }

//     // CHECK IF RECEIVER IS BLOCKED
//     else if (currentUser.blocked.includes(user.id)) {
//       return set({
//         chatId,
//         user: user,
//         IsCurrentUserBlocked: false,
//         IsReceiverBlocked: true,
//       });
//     } else {
//       return set({
//         chatId,
//         user,
//         IsCurrentUserBlocked: false,
//         IsReceiverBlocked: false,
//       });
//     }
//   },
//   changeBlock: () => {
//     set((state) => ({...state, IsReceiverBlocked : !state.IsReceiverBlocked }));
//   },
//   resetChat: () => {
//     set({
//       chatId: null,
//       user: null,
//       isCurrentUserBlocked: false,
//       isReceiverBlocked: false,
//     });
//   },
// }));



import { create } from "zustand";
import { userStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  
  changeChat: (chatId, user) => {
    const currentUser = userStore.getState().currentUser;

    // CHECK IF CURRENT USER IS BLOCKED
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // CHECK IF RECEIVER IS BLOCKED
    if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }

    return set({
      chatId,
      user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },

  changeBlock: () => {
    const currentUser = userStore.getState().currentUser;
    const { user } = useChatStore.getState();

    // Re-fetch user data to sync state
    userStore.getState().fetchUserInfo(currentUser.id, (updatedUser) => {
      const isReceiverBlocked = updatedUser.blocked.includes(user.id);
      set({ isReceiverBlocked });
    });
  },

  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
}));
