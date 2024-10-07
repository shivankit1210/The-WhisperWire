import React, { useEffect, useState } from 'react'
import "./chatlist.css";
import Adduser from './addUser/Adduser';
import { userStore } from '../../../library/userStore';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../../../library/firebase';
import { doc } from 'firebase/firestore';



const ChatList = () => {


  const [addMode,SetAddMode]=useState(false);
  const [chats,setChats] =useState([]);
  const { currentUser,IsLoading} = userStore();

  useEffect(()=>{
// Return early if the user is still loading or if there's no user
    if (IsLoading || !currentUser?.uid) return;

    const unSub = onSnapshot(doc(db,"userchats",currentUser.uid), (doc)=>{
      if (doc.exists()) {
        setChats(doc.data());
      } else {
        console.log("No chat data found");
        setChats([]); // Handle no chats scenario
      }  
    });

    return ()=>{
      unSub();
    };

  },[currentUser?.uid,IsLoading]);
  console.log(chats);

  if (IsLoading) {
    return <div>Loading...</div>; // Add a loading indicator if needed
  }

  if (!currentUser) {
    return <div>No user data found</div>; // Handle the case where no user data is available
  }





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