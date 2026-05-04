import List from "./components/list/List";
import { lazy, Suspense, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./library/firebase";
import { userStore } from "./library/userStore";
import "./index.css";
import { useChatStore } from "./library/chatStore";
import Icon from "./components/icons/Icon";

const Chat = lazy(() => import("./components/chat/Chat"));
const Detail = lazy(() => import("./components/detail/Detail"));
const Login = lazy(() => import("./components/login/Login"));
const Notification = lazy(() => import("./components/notification/Notification"));

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = userStore();
  const { chatId, resetChat } = useChatStore();
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      resetChat();
      setOpenChat(false);
      fetchUserInfo(user?.uid);
    });

    //CleanUp Function
    return () => {
      unSub();
    };
  }, [fetchUserInfo, resetChat]);

  if (isLoading) {
    return <div className="loading">loading...</div>;
  }

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List setOpenChat={setOpenChat} openChat={openChat} />

          <Suspense fallback={null}>
            {chatId ? (
              <Chat openChat={openChat} setOpenChat={setOpenChat} />
            ) : (
              <div className="emptyChat">
                <div className="emptyChat__icon">
                  <Icon name="search" size={30} />
                </div>
                <h2>Select a conversation</h2>
                <p>Search your chats or add a user to start messaging.</p>
              </div>
            )}
            {chatId && <Detail />}
          </Suspense>
        </>
      ) : (
        <Suspense fallback={null}>
          <Login />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <Notification />
      </Suspense>
    </div>
  );
};

export default App;
