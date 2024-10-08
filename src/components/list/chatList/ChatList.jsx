import React, { useState } from 'react'
import "./chatlist.css";
import Adduser from './addUser/Adduser';

const ChatList = () => {

  const [addMode,SetAddMode]=useState(false);

  return (
    <div className='ChatList p-2 relative'>

      {/* Search Bar Start */}
      <div className="searchbar flex  justify-between gap-1">
        <div className="search p-1 rounded-lg flex justify-between gap-2 items-center">
          <img className='w-5 h-4' src="./search.png" alt="" />
          <input className='w-44 h-5 rounded-sm bg-blue-100 bg-transparent border-none outline-none text-blue-200 size-2 ' type="text" placeholder='search' />
        </div>
        <div className=' plus flex justify-center items-center p-1 rounded-xl'>
          <img className='w-5 h-5 hover:cursor-pointer' src={addMode ? "./minus.png" : "./plus.png"} onClick={()=>SetAddMode((prev)=>!prev)} alt="" />
        </div>
      </div>

      {/* Chats Section Start Here */}

      <div className=" py-2 flex items-center gap-4 border-b border-gray-400 ">
        <img className='w-8 h-8' src="./avatar.png" alt="" />
        <div className="texts">
          <h1 className='text-white text-lg'>Pari</h1>
          <p className='text-white text-xs'>Holaaa ! How have you been?</p>
        </div>
      </div>
      <div className=" py-2 flex items-center gap-4 border-b border-gray-400">
        <img className='w-8 h-8' src="./avatar.png" alt="" />
        <div className="texts">
          <h1 className='text-white text-lg'>Mayank</h1>
          <p className='text-white text-xs'>What are you doing bro?</p>
        </div>
      </div>
      <div className=" py-2 flex items-center gap-4 border-b border-gray-400">
        <img className='w-8 h-8' src="./avatar.png" alt="" />
        <div className="texts">
          <h1 className='text-white text-lg'>Piyush</h1>
          <p className='text-white text-xs'>Where are you? i am coming </p>
        </div>
      </div>
      <div className=" py-2 flex items-center gap-4 border-b border-gray-400">
        <img className='w-8 h-8' src="./avatar.png" alt="" />
        <div className="texts">
          <h1 className='text-white text-lg'>Divyanshu</h1>
          <p className='text-white text-xs'>today is the best day bro :)</p>
        </div>
      </div>
     {addMode&& <Adduser/>}
    </div>
  )
}

export default ChatList