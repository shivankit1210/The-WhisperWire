import React from 'react'
import "./userinfo.css"

const userinfo = () => {
  return (
    <div className='userInfo flex justify-between items-center p-2 '>
     <div className="user flex  items-center justify-start gap-3">
      <img className='w-7 h-7 ' src="./avatar.png" alt="" />
      <h1 className='text-white'>Shivankit</h1>
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