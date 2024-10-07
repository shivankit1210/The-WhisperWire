import React from 'react'
import "./userinfo.css";
import { userStore } from '../../../library/userStore';


const userinfo = () => {

  const {currentUser} = userStore();


  return (
    <div className='userInfo flex justify-between items-center p-2 '>
     <div className="user flex  items-center justify-start gap-3">
      <img className='w-7 h-7 ' src={currentUser.avatar || "./avatar.png"} alt="" />
      <h1 className='text-white'>{currentUser.username}</h1>
     </div>
     <div className="icon cursor-pointer w-24 gap-5 flex justify-evenly">
      <img className='w-5 h-5' src="./more.png" alt="" />
      <img className='w-5 h-5' src="./video.png" alt="" />
      <img className='w-5 h-5' src="./edit.png" alt="" />
     </div>
    </div>
  )
}

export default userinfo