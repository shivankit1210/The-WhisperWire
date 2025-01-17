import "./list.css";
import React from 'react'
import ChatList from "./chatList/ChatList";
import Userinfo from "./userinfo/Userinfo";

const List = ({setOpenChat,openChat}) => {
  return (
    <div className={`list ${openChat ? "hidden md:block" : "block"}`}>
      <Userinfo/>
      <ChatList setOpenChat={setOpenChat} openChat={openChat}/>
    </div>
  )
}

export default List