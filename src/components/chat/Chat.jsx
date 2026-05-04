import "./chat.css";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../library/firebase";
import { useChatStore } from "../../library/chatStore";
import { userStore } from "../../library/userStore";
import upload from "../../library/upload";
import Icon from "../icons/Icon";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

const Chat = ({ openChat, setOpenChat }) => {
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = userStore();

  const endRef = useRef(null);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg((prev) => {
        if (prev.url) URL.revokeObjectURL(prev.url);
        return {
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
        };
      });
    }
  };

  const handleSend = async () => {
    if (text.trim() === "" && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          SenderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      await Promise.all(userIDs.map(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        //if any changes happen than it get it and update the usechatsdata variable
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          if (chatIndex === -1) return;
          // inside userChats we have chat array
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          // update our document using refrence of chats which is currently active
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }));
    } catch (err) {
      console.error(err);
    }

    if (img.url) URL.revokeObjectURL(img.url);
    setImg({
      file: null,
      url: "",
    });

    setText("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (!chatId) return;

    setChat(null);
    setText("");
    setImg((prev) => {
      if (prev.url) URL.revokeObjectURL(prev.url);
      return {
        file: null,
        url: "",
      };
    });

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  useEffect(() => {
    return () => {
      if (img.url) URL.revokeObjectURL(img.url);
    };
  }, [img.url]);

  return (
    <div
      className={`${openChat ? "chat--open" : ""} chat`}
    >
      <div className="chat__top">
        <button
          type="button"
          onClick={() => setOpenChat(false)}
          className="chat__back"
          aria-label="Back to chats"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="chat__user">
          <img
            src={user?.avatar || "./avatar.png"}
            alt=""
          />
          <div className="chat__userText">
            <span>{user?.username}</span>
            <small>Active conversation</small>
          </div>
        </div>
        <div className="chat__actions">
          <button className="iconButton" type="button" aria-label="Voice call">
            <Icon name="phone" />
          </button>
          <button className="iconButton" type="button" aria-label="Video call">
            <Icon name="video" />
          </button>
          <button className="iconButton" type="button" aria-label="Chat info">
            <Icon name="info" />
          </button>
        </div>
      </div>

      <div className="chat__body">
      <div className="center">
        {chat?.messages?.map((message, index) => {
          return (
            <div
              className={
                message.SenderId === currentUser?.id
                  ? "message own "
                  : "message"
              }
              // className={message.SenderId === currentUser?.id ? "message own m-0 flex gap-3 place-content-end " : "message m-0 flex gap-3"}
              key={`${message?.createdAt?.seconds || "local"}-${index}`}
            >
              <div className="texts">
                {message.img && (
                  <img className="message__image" src={message.img} alt="" />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img className="message__image" src={img.url} alt="Selected upload preview" />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="chat__tools">
          <label className="iconButton" htmlFor="file" aria-label="Attach image">
            <Icon name="image" />
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <button className="iconButton" type="button" aria-label="Record audio">
            <Icon name="mic" />
          </button>
        </div>
        <input
          className="chatInput"
          type="text"
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <button className="iconButton" type="button" aria-label="Open emoji picker" onClick={() => setOpen((prev) => !prev)}>
            <Icon name="smile" />
          </button>
          <div className="picker">
            {open && (
              <Suspense fallback={null}>
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
              </Suspense>
            )}
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          aria-label="Send message"
        >
          <Icon name="send" />
        </button>
      </div>

      </div>
      
    </div>
  );
};

export default Chat;
