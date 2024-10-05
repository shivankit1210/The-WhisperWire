import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "./library/firebase"

const App = () => {
  const user = false;

 
  useEffect(()=>{
    const unSub= onAuthStateChanged(auth,(user)=>{
      console.log(user);
    })

    //CleanUp Function
    return ()=>{
      unSub();
    };

  },[])

  return (
    <div className="container">
      {user ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notification/>
    </div>
  );
};

export default App;
