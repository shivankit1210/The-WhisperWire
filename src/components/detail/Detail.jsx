import { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../library/chatStore";
import { auth, db } from "../../library/firebase";
import { userStore } from "../../library/userStore";
import "./detail.css";
import Icon from "../icons/Icon";

const Detail = () => {
  const [sharedPhotos, setSharedPhotos] = useState([]);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = userStore();

  useEffect(() => {
    if (!chatId) {
      setSharedPhotos([]);
      return;
    }

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const messages = res.data()?.messages || [];
      const photos = messages
        .filter((message) => message.img)
        .map((message, index) => ({
          id: `${message.createdAt?.seconds || "photo"}-${index}`,
          url: message.img,
          label: `Shared photo ${index + 1}`,
        }));

      setSharedPhotos(photos.reverse());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleBlock = async () => {
    if (!user || !currentUser?.id) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      userStore.getState().fetchUserInfo(currentUser.id, () => {
        changeBlock();
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="detail">
      <div className="detail__user">
        <img src={user?.avatar || "./avatar.png"} alt="user Profile" />
        <h1>{user?.username}</h1>
        <p>{isReceiverBlocked ? "Blocked by you" : "Conversation details"}</p>
      </div>

      <div className="detail__info">
        <div className="detail__option">
          <div className="detail__title">
            <span>Chat settings</span>
            <Icon name="info" />
          </div>
        </div>

        <div className="detail__option">
          <div className="detail__title">
            <span>Privacy and help</span>
            <Icon name="more" />
          </div>
        </div>

        <div className="detail__option">
          <div className="detail__title">
            <span>Shared photos</span>
            <Icon name="image" />
          </div>

          <div className="detail__photos">
            {sharedPhotos.length > 0 ? (
              sharedPhotos.map((photo) => (
                <a
                  className="detail__photo"
                  href={photo.url}
                  key={photo.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={photo.url} alt={photo.label} />
                  <span>{photo.label}</span>
                  <Icon name="image" />
                </a>
              ))
            ) : (
              <p className="detail__empty">No shared photos yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="detail__actions">
        <button
          className="detail__button detail__button--danger"
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "Unblock user"
            : "Block user"}
        </button>
        <button className="detail__button" onClick={() => auth.signOut()}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default Detail;
