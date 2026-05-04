import "./list.css";
import ChatList from "./chatList/ChatList";
import Userinfo from "./userinfo/Userinfo";

const List = ({setOpenChat,openChat}) => {
  return (
    <div className={`list ${openChat ? "list--mobileHidden" : ""}`}>
      <Userinfo/>
      <ChatList setOpenChat={setOpenChat}/>
    </div>
  )
}

export default List
