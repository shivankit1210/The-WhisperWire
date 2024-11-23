import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "./library/firebase"
import { userStore } from "./library/userStore";
import "./index.css"
import { useChatStore } from "./library/chatStore";

const App = () => {

  const {currentUser,IsLoading,fetchUserInfo} = userStore();
  const {chatId} = useChatStore();

 
  useEffect(()=>{
    const unSub= onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid)
    })

    //CleanUp Function
    return ()=>{
      unSub();
    };

  },[fetchUserInfo])

  // console.log(currentUser);
  if(IsLoading){
    return <div className="loading">  
      loading...
    </div>
  }

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat/>}
          {chatId && <Detail/>}
        </>
      ) : (
        <Login />
      )}
      <Notification/>
    </div>
  );
};

export default App;
