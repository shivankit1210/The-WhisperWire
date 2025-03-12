import "./chat.css";
import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
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
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

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

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        //if any changes happen than it get it and update the usechatsdata variable
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
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
      });
    } catch (err) {
      console.log(err);
    }

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
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleBack = () => {
    setOpenChat(!openChat);
  };
  // ${openChat ? "block" : "hidden"}

  return (
    <div
      className={` ${
        openChat ? "block " : "hidden"
      } chat border-gray-400 rounded-sm border-x h-[120vh] md:h-[100%] md:m-0 m-0 p-2 relative`}
    >
      {/* back button  */}
      {/* Top Section of Chat Start */}
      <div className="top flex  justify-between  md:p-1 p-4 items-center border-b">
        <div
          onClick={handleBack}
          className={`${
            openChat ? "block md:hidden" : "hidden"
          } absolute text-white text-5xl left-2 `}
        >
          {"<"}
        </div>

        <div className="user ml-5 md:ml-0 flex gap-2">
          <img
            className="md:w-8 md:h-8 w-14 h-14 rounded-full"
            src={user?.avatar || "./avatar.png"}
            alt=""
          />
          <div className="texts text-gray-300 flex justify-center items-center">
            <span className="md:text-lg text-4xl ">{user?.username}</span>
          </div>
        </div>
        <div className="icon flex md:gap-4 gap-6">
          <img
            className="md:w-4 md:h-4 w-6 h-6"
            src="./phone.png"
            alt=""
            srcset=""
          />
          <img
            className="md:w-4 md:h-4 w-6 h-6"
            src="./video.png"
            alt=""
            srcset=""
          />
          <img
            className="md:w-4 md:h-4 w-6 h-6"
            src="./info.png"
            alt=""
            srcset=""
          />
        </div>
      </div>

      <div className="md:h-[93%] h-[90%] flex flex-col justify-between">
        {/* messages Display Start here */}
      <div className="center overflow-scroll  overflow-x-hidden flex flex-col gap-y-3 text-white">
        {chat?.messages?.map((message) => {
          return (
            <div
              className={
                message.SenderId === currentUser?.id
                  ? "message own "
                  : "message"
              }
              // className={message.SenderId === currentUser?.id ? "message own m-0 flex gap-3 place-content-end " : "message m-0 flex gap-3"}
              key={message?.createAt}
            >
              <div className="texts flex flex-col w-80   justify-center p-1">
                {message.img && (
                  <img className="w-36 h-40" src={message.img} alt="" />
                )}
                <p className="md:text-sm text-xl text-blue-900 font-light bg-white rounded-md p-2 md:p-1 mt-2 md:mt-1">
                  {message.text}
                </p>
              </div>
              {/* <img
                className="w-8 h-8 rounded-2xl"
                src="./avatar.png"
                alt=""
                srcset=""
              /> */}
            </div>
          );
        })}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>

      {/* Type And Send Section Start here */}
      <div className="bottom flex justify-between items-center p-2">
        <div className="icon flex gap-2">
          <label htmlFor="file">
            <img
              className="md:w-5 md:h-5 w-8 h-8"
              src="./img.png"
              alt=""
              srcset=""
            />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          {/* <img className="md:w-5 md:h-5 w-8 h-8" src="./camera.png" alt="" srcset="" /> */}
          <img
            className="md:w-5 md:h-5 w-8 h-8"
            src="./mic.png"
            alt=""
            srcset=""
          />
        </div>
        <input
          className=" chatInput md:h-[2rem] h-[3rem] w-[18rem] md:w-[28rem] bg-transparent border-b border-none outline-none text-white rounded-[0.225rem] p-2 text-sm"
          type="text"
          name=""
          value={text}
          id=""
          placeholder="Type a message....."
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            className="md:w-5 md:h-5 w-8 h-8"
            src="./emoji.png"
            onClick={() => setOpen((prev) => !prev)}
            alt=""
            srcset=""
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="pl-2 sendButton bg-slate-400 p-2 rounded-xl"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>

      </div>
      
    </div>
  );
};

export default Chat;
