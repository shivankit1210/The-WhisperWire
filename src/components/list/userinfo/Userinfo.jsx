import "./userinfo.css";
import { userStore } from '../../../library/userStore';
import { auth } from "../../../library/firebase";
import Icon from "../../icons/Icon";


const userinfo = () => {

  const {currentUser} = userStore();


  return (
    <div className='userInfo'>
     <div className="userInfo__profile">
      <img className='userInfo__avatar' src={currentUser.avatar || "./avatar.png"} alt="" />
      <div className="userInfo__text">
        <span>Signed in as</span>
        <h1>{currentUser.username}</h1>
      </div>
     </div>
     <div className="userInfo__actions">
      <button className="iconButton" type="button" aria-label="More options">
        <Icon name="more" />
      </button>
      <button className="iconButton" type="button" aria-label="Start video">
        <Icon name="video" />
      </button>
      <button className="iconButton" type="button" aria-label="Edit profile">
        <Icon name="edit" />
      </button>
      <button className="iconButton iconButton--danger" type="button" aria-label="Log out" onClick={() => auth.signOut()}>
        <Icon name="logOut" />
      </button>
     </div>
    </div>
  )
}

export default userinfo
