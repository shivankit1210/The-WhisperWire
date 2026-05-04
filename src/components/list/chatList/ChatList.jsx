import { useEffect, useState } from "react";
import "./chatList.css";
import Adduser from "./addUser/Adduser";
import { userStore } from "../../../library/userStore";
import { doc,getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../library/firebase";
import { useChatStore } from "../../../library/chatStore";
import Icon from "../../icons/Icon";

const ChatList = ({setOpenChat}) => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [addMode, SetAddMode] = useState(false);
  const { currentUser, isLoading } = userStore();

  const { changeChat } = useChatStore();

  useEffect(() => {
    if (isLoading || !currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), 
    async (res) => {
        const items= res.data()?.chats || [];

        const promises =items.map(async (item)=>{
          const userDocRef= doc(db,"users" , item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const  user= userDocSnap.data();

          return {...item,user};
        });

        const chatData =await Promise.all(promises)

        setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser?.id, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading indicator if needed
  }

  if (!currentUser) {
    return <div>No user data found</div>; // Handle the case where no user data is available
  }



  const filteredChats = chats.filter((chat) => {
    const username = chat.user?.username?.toLowerCase() || "";
    const lastMessage = chat.lastMessage?.toLowerCase() || "";
    const queryText = search.trim().toLowerCase();

    return username.includes(queryText) || lastMessage.includes(queryText);
  });

  const handleSelect = async (chat) =>{

    const userChats= chats.map((item)=>{
      const rest = { ...item };
      delete rest.user;
      return rest;
    })

      const chatIndex = userChats.findIndex(item=>item.chatId === chat.chatId);
      if (chatIndex === -1) return;
      userChats[chatIndex].isSeen = true;

      const userChatsRef = doc(db,"userchats",currentUser.id);

      try {
        await updateDoc(userChatsRef,{
          chats:userChats,
        })
        changeChat(chat.chatId,chat.user)
      } catch (error) {
        console.error(error)
      }

      setOpenChat(true);
  }

 

  return (
    <div className="ChatList">
      <div className="ChatList__toolbar">
        <div className="search">
          <Icon name="search" className="search__icon" />
          <input
            type="text"
            placeholder="Search chats"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="ChatList__addButton"
          type="button"
          aria-label={addMode ? "Close user search" : "Search for a new user"}
          onClick={() => SetAddMode((prev) => !prev)}
        >
          <Icon name={addMode ? "x" : "plus"} />
        </button>
      </div>

      <div className="ChatList__items">
        {filteredChats.map((chat) => {

          return (
            <button
              className={`ChatList__item ${chat?.isSeen ? "" : "ChatList__item--unread"}`}
              key={chat.chatId}
              type="button"
              onClick={()=>handleSelect(chat)}
            >
              <img className="ChatList__avatar" src={chat.user?.avatar || "./avatar.png"} alt="" />
              <span className="ChatList__content">
                <span className="ChatList__name">{chat.user?.username}</span>
                <span className="ChatList__message">{chat.lastMessage || "No messages yet"}</span>
              </span>
              {!chat?.isSeen && <span className="ChatList__badge" aria-label="Unread chat"></span>}
            </button>
          )
        })}

        {filteredChats.length === 0 && (
          <div className="ChatList__empty">
            <Icon name="search" />
            <p>{search ? "No chats match your search." : "No chats yet. Add someone to start."}</p>
          </div>
        )}
      </div>

      {addMode && <Adduser existingChats={chats} onClose={() => SetAddMode(false)} />}
    </div>
  );
};

export default ChatList;
