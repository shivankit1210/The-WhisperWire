import "./Adduser.css";
import React, { useState } from "react";
import { userStore } from "../../../../library/userStore";
import { db } from "../../../../library/firebase";
import {
  collection,
  getDocs,
  where,
  query,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

const Adduser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = userStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);
      console.log("s", querySnapShot);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const userChatsRef = collection(db, "userchats");
    const chatRef = collection(db, "chats");
    // console.log(chatRef);

    try {
      console.log("inside handle,try")
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef?.id,
          lastMessage: "",
          receiverId: currentUser?.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef?.id,
          lastMessage: "",
          receiverId: user?.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="addUser flex flex-col p-5 text-black">
      <form className="flex flex-row gap-x-5" onSubmit={handleSearch}>
        <input
          className="bg-white p-1 w-52 rounded-md"
          type="text"
          placeholder="Username"
          name="username"
        />
        <button id="search" className="p-1 w-14 bg-blue-500 border-none">
          Search
        </button>
      </form>
      {user && (
        <div className="user flex justify-between items-center p-1  ">
          <div className="detail flex p-1 place-content-center items-center bg-white w-96 my-2 rounded-md gap-x-3">
            <img
              className="w-5 h-5 rounded-full"
              src={user?.avatar || "./avatar.png"}
              alt=""
            />
            <span className=""> {user?.username}</span>
          </div>
          <button
            className="p-1 w-14 bg-blue-500 border-none text-xs"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default Adduser;
