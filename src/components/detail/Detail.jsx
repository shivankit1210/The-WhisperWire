// import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
// import { useChatStore } from "../../library/chatStore";
// import { auth, db } from "../../library/firebase";
// import { userStore } from "../../library/userStore";
// import "./detail.css";
// import React from "react";

// const Detail = () => {
//   const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
//     useChatStore();
//   const { currentUser } = userStore();

//   const handleBlock = async () => {
//     console.log("user is blocked ",user)
//     if (!user) return;
//     const userDocRef = doc(db, "users", currentUser.id);

//     try {
//       await updateDoc(userDocRef, {
//         blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
//       });
//       await userStore.fetchUserInfo(currentUser.id);
//       changeBlock();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="detail p-2">
//       <div className="user py-3 flex flex-col border-b border-gray-400 place-content-center items-center">
//         <img
//           className="w-16 h-16 rounded-full"
//           src={user?.avatar || "./avatar.png"}
//           alt=""
//         />
//         <h1 className="text-white">{user?.username}</h1>
//         <p className="text-white"> Lorem ipsum dolor sit. </p>
//       </div>

//       <div className="info ">
//         <div className="option py-2">
//           <div className="title flex justify-between">
//             <span className=" text-xs text-white">Chat Setting</span>
//             <img
//               className="w-5 h-5 p-1 bg-blue-900 rounded-full"
//               src="./arrowUp.png"
//               alt=""
//             />
//           </div>
//         </div>

//         <div className="option py-2">
//           <div className="title flex justify-between">
//             <span className=" text-xs  text-white">Privacy % Help</span>
//             <img
//               className="w-5 h-5 p-1 bg-blue-900 rounded-full"
//               src="./arrowUp.png"
//               alt=""
//             />
//           </div>
//         </div>

//         <div className="option py-2">
//           <div className="title flex justify-between">
//             <span className=" text-xs text-white">Shared Photos</span>
//             <img
//               className="w-5 h-5 p-1 bg-blue-900 rounded-full"
//               src="./arrowDown.png"
//               alt=""
//             />
//           </div>
//           <div className="photos">
//             <div className="photoItem flex justify-between py-3 items-center">
//               <div className="photoDetails flex gap-x-3">
//                 <img
//                   className="w-6 h-6 rounded-sm"
//                   src="https://imgs.search.brave.com/jenx2PVqWsiRSBMMdhthmPAfdY0i5iX0KRhqnVE33HY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzY5LzMyLzI4/LzM2MF9GXzQ2OTMy/Mjg3M19uclN1enhN/QkplWUxWMmdxbFdW/dlRmb0libFdpWTYx/eC5qcGc"
//                   alt=""
//                 />
//                 <span className="text-sm">photot344.png</span>
//               </div>
//               <img
//                 className="w-5 h-5 p-1 bg-blue-900 rounded-sm "
//                 src="./download.png"
//                 alt=""
//               />
//             </div>

//             <div className="photoItem flex justify-between py-2 items-center">
//               <div className="photoDetails flex gap-x-3">
//                 <img
//                   className="w-6 h-6 rounded-sm"
//                   src="https://imgs.search.brave.com/jenx2PVqWsiRSBMMdhthmPAfdY0i5iX0KRhqnVE33HY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzY5LzMyLzI4/LzM2MF9GXzQ2OTMy/Mjg3M19uclN1enhN/QkplWUxWMmdxbFdW/dlRmb0libFdpWTYx/eC5qcGc"
//                   alt=""
//                 />
//                 <span className="text-sm">photot344.png</span>
//               </div>
//               <img
//                 className="w-5 h-5 p-1 bg-blue-900 rounded-sm "
//                 src="./download.png"
//                 alt=""
//               />
//             </div>

//             <div className="photoItem flex justify-between py-2 items-center">
//               <div className="photoDetails flex gap-x-3">
//                 <img
//                   className="w-6 h-6 rounded-sm"
//                   src="https://imgs.search.brave.com/jenx2PVqWsiRSBMMdhthmPAfdY0i5iX0KRhqnVE33HY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzY5LzMyLzI4/LzM2MF9GXzQ2OTMy/Mjg3M19uclN1enhN/QkplWUxWMmdxbFdW/dlRmb0libFdpWTYx/eC5qcGc"
//                   alt=""
//                 />
//                 <span className="text-sm">photot344.png</span>
//               </div>
//               <img
//                 className="w-5 h-5 p-1 bg-blue-900 rounded-sm "
//                 src="./download.png"
//                 alt=""
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="option">
//         <div className="title flex justify-between">
//           <span className="text-white text-xs">Shared Files</span>
//           <img
//             className="w-5 h-5 bg-blue-900 rounded-full p-1"
//             src="./arrowUp.png"
//             alt=""
//           />
//         </div>
//       </div>
//       <div className="flex flex-col place-content-center py-2 gap-2">
//         <button
//           className="border-none bg-red-700 text-sm  text-white w-[100%] rounded-sm cursor-pointer hover:bg-red-800 p-1"
//           onClick={handleBlock}
//         >
//           {
//           isCurrentUserBlocked
//             ? "You Are Blocked! "
//             : isReceiverBlocked
//             ? "User Blocked! "
//             : "Block user"
//             }
//         </button>
//         <button
//           className="border-none bg-blue-700 text-sm  text-white w-[100%] rounded-sm cursor-pointer hover:bg-blue-800 p-1"
//           onClick={() => auth.signOut()}
//         >
//           LogOut user
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Detail;
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../library/chatStore";
import { auth, db } from "../../library/firebase";
import { userStore } from "../../library/userStore";
import "./detail.css";
import React from "react";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = userStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      // Fetch updated user info and update states
      userStore.getState().fetchUserInfo(currentUser.id, () => {
        changeBlock();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="detail p-2">
      <div className="user py-3 flex flex-col border-b border-gray-400 place-content-center items-center">
        <img
          className="w-16 h-16 rounded-full"
          src={user?.avatar || "./avatar.png"}
          alt=""
        />
        <h1 className="text-white">{user?.username}</h1>
        {/* <p className="text-white"> Lorem ipsum dolor sit. </p> */}
      </div>

      <div className="info ">
        <div className="option py-2">
          {" "}
          <div className="title flex justify-between">
            <span className=" text-xs text-white">Chat Setting</span>
            <img
              className="w-5 h-5 p-1 bg-blue-900 rounded-full"
              src="./arrowUp.png"
              alt=""
            />
          </div>
        </div>

        <div className="option py-2">
          <div className="title flex justify-between">
            <span className=" text-xs  text-white">Privacy % Help</span>
            <img
              className="w-5 h-5 p-1 bg-blue-900 rounded-full"
              src="./arrowUp.png"
              alt=""
            />
          </div>
        </div>

        <div className="option py-2">
          <div className="title flex justify-between">
            <span className=" text-xs text-white">Shared Photos</span>
            <img
              className="w-5 h-5 p-1 bg-blue-900 rounded-full"
              src="./arrowDown.png"
              alt=""
            />
          </div>
          <div className="photos">
            <div className="photoItem flex justify-between py-3 items-center">
              <div className="photoDetails flex gap-x-3">
                <img
                  className="w-6 h-6 rounded-sm"
                  src="https://imgs.search.brave.com/jenx2PVqWsiRSBMMdhthmPAfdY0i5iX0KRhqnVE33HY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzY5LzMyLzI4/LzM2MF9GXzQ2OTMy/Mjg3M19uclN1enhN/QkplWUxWMmdxbFdW/dlRmb0libFdpWTYx/eC5qcGc"
                  alt=""
                />
                <span className="text-sm">photot344.png</span>
              </div>
              <img
                className="w-5 h-5 p-1 bg-blue-900 rounded-sm "
                src="./download.png"
                alt=""
              />
            </div>

            <div className="photoItem flex justify-between py-2 items-center">
              <div className="photoDetails flex gap-x-3">
                <img
                  className="w-6 h-6 rounded-sm"
                  src="https://imgs.search.brave.com/jenx2PVqWsiRSBMMdhthmPAfdY0i5iX0KRhqnVE33HY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzY5LzMyLzI4/LzM2MF9GXzQ2OTMy/Mjg3M19uclN1enhN/QkplWUxWMmdxbFdW/dlRmb0libFdpWTYx/eC5qcGc"
                  alt=""
                />
                <span className="text-sm">photot344.png</span>
              </div>
              <img
                className="w-5 h-5 p-1 bg-blue-900 rounded-sm "
                src="./download.png"
                alt=""
              />
            </div>

            <div className="photoItem flex justify-between py-2 items-center">
              <div className="photoDetails flex gap-x-3">
                <img
                  className="w-6 h-6 rounded-sm"
                  src="https://imgs.search.brave.com/jenx2PVqWsiRSBMMdhthmPAfdY0i5iX0KRhqnVE33HY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzY5LzMyLzI4/LzM2MF9GXzQ2OTMy/Mjg3M19uclN1enhN/QkplWUxWMmdxbFdW/dlRmb0libFdpWTYx/eC5qcGc"
                  alt=""
                />
                <span className="text-sm">photot344.png</span>
              </div>
              <img
                className="w-5 h-5 p-1 bg-blue-900 rounded-sm "
                src="./download.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div className="info flex flex-col  gap-y-2 bg-black h-[12%]">
        <button
          className="border-none  bg-red-500 text-sm text-white w-[100%] rounded-sm cursor-pointer p-1"
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? "You Are Blocked!"
            : isReceiverBlocked
            ? "User Blocked!"
            : "Block User"}
        </button>
        <button
          className="border-none bg-blue-700 text-sm  text-white w-[100%] rounded-sm cursor-pointer hover:bg-blue-800 p-1"
          onClick={() => auth.signOut()}
        >
          LogOut user
        </button>
      </div>
    </div>
  );
};

export default Detail;
