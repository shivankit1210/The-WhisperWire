import "./Adduser.css";
import { useState } from "react";
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
} from "firebase/firestore";
import Icon from "../../../icons/Icon";

const Adduser = ({ existingChats = [], onClose }) => {
  const [user, setUser] = useState(null);
  const [queryText, setQueryText] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const { currentUser } = userStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const username = queryText.trim();

    setUser(null);
    setFeedback("");

    if (!username) {
      setFeedback("Enter an exact username to search.");
      return;
    }

    try {
      setStatus("loading");
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const foundUser = querySnapShot.docs[0].data();

        if (foundUser.id === currentUser?.id) {
          setFeedback("You are already signed in as this user.");
          return;
        }

        if (existingChats.some((chat) => chat.receiverId === foundUser.id)) {
          setFeedback("This user is already in your chat list.");
          return;
        }

        setUser(foundUser);
      } else {
        setFeedback("No user found with that exact username.");
      }
    } catch (error) {
      console.error(error);
      setFeedback("Search failed. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  const handleAdd = async () => {
    if (!user) return;

    const userChatsRef = collection(db, "userchats");
    const chatRef = collection(db, "chats");
    try {
      setStatus("adding");
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

      onClose?.();
    } catch (error) {
      console.error(error);
      setFeedback("Could not add this user. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="addUser">
      <div className="addUser__header">
        <div>
          <span>New conversation</span>
          <h2>Find a user</h2>
        </div>
        <button className="iconButton" type="button" aria-label="Close user search" onClick={onClose}>
          <Icon name="x" />
        </button>
      </div>

      <form className="addUser__form" onSubmit={handleSearch}>
        <div className="addUser__inputWrap">
          <Icon name="search" />
        <input
          type="text"
            placeholder="Search exact username"
          name="username"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
        />
        </div>
        <button className="addUser__searchButton" disabled={status === "loading"}>
          {status === "loading" ? "Searching" : "Search"}
        </button>
      </form>

      {feedback && <p className="addUser__feedback">{feedback}</p>}

      {user && (
        <div className="addUser__result">
          <div className="addUser__person">
            <img
              src={user?.avatar || "./avatar.png"}
              alt=""
            />
            <span>{user?.username}</span>
          </div>
          <button
            className="addUser__addButton"
            onClick={handleAdd}
            disabled={status === "adding"}
          >
            {status === "adding" ? "Adding" : "Add"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Adduser;
