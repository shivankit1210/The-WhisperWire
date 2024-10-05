import "./chat.css"
import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from "emoji-picker-react";

const Chat = () => {

  const handleEmoji = (e)=>{
    setText(prev=>prev+e.emoji);
    setOpen(false);
  }

  const [open,setOpen]= useState(false);
  const [text,setText]= useState("");

  const endRef=useRef(null);

  useEffect(()=>{
  endRef.current?.scrollIntoView({behavior:"smooth"});
  },[]);


  // console.log(text);

  return (
    <div className="chat border-x border-gray-400 rounded-sm p-2">

      {/* Top Section of Chat Start */}
      <div className="top flex  justify-between  p-1 items-center border-b">
        <div className="user flex gap-2">
          <img className="w-8 h-8" src="./avatar.png" alt="" />
          <div className="texts text-gray-300">
            <span className="text-lg">Pari</span>
            <p className="text-xs">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda, soluta.</p>
          </div>
        </div>
        <div className="icon flex gap-4">
          <img className="w-4 h-4" src="./phone.png" alt="" srcset="" />
          <img className="w-4 h-4" src="./video.png" alt="" srcset="" />
          <img className="w-4 h-4" src="./info.png" alt="" srcset="" />
        </div>
      </div>

      {/* messages Display Start here */}
      <div className="center overflow-scroll overflow-x-hidden flex flex-col gap-y-3 text-white">
        
        <div className="message m-0 flex gap-0 place-content-end">
          <div className="texts flex flex-col   w-80  justify-center p-1">
            <p className="text-sm text-blue-900 bg-white rounded-md p-1">hiii, pari! how have you been Lorem ipsum dolor sit amet.</p>
            <span className="text-xs">1 min ago!</span>
          </div>
          <img className="w-8 h-8 rounded-2xl" src="./avatar.png" alt="" srcset="" />
        </div> 

        <div className="message w-[22rem] flex  gap-0 ">
          <img className="w-8 h-8 rounded-2xl" src="./avatar.png" alt="" srcset="" />
          <div className="texts flex flex-col  w-80   justify-center p-1">
            <p className="text-sm bg-blue-900 rounded-md p-1"> Lorem ipsum dolor sit, amet consectetur a officia onsequatur inventore ducimus m molestiae aliquam?</p>
            <span className="text-xs">1 min ago!</span>
          </div>
        </div>
        <div className="message m-0 flex gap-0 place-content-end">
          <div className="texts flex flex-col   w-80  justify-center p-1">
            <p className="text-sm text-blue-900 bg-white rounded-md p-1">hiii, pari! how Lorem ipsum dolor sit amet. have you been </p>
            <span className="text-xs">1 min ago!</span>
          </div>
          <img className="w-8 h-8 rounded-2xl" src="./avatar.png" alt="" srcset="" />
        </div> 

        <div className="message w-[22rem] flex  gap-0 ">
          <img className="w-8 h-8 rounded-2xl" src="./avatar.png" alt="" srcset="" />
          <div className="texts flex flex-col  w-80   justify-center p-1">
            <p className="text-sm bg-blue-900 rounded-md p-1"> Lorem ipsum dolor sit, amet consectetur a officia onsequatur inventore ducimus m molestiae aliquam?</p>
            <span className="text-xs">1 min ago!</span>
          </div>
        </div>


        <div className="message m-0 flex gap-3 place-content-end">
          <div className="texts flex flex-col w-80   justify-center p-1">
            <img src="https://imgs.search.brave.com/s6V3FISMp_mayKPok2qti3iLz5mkwG2im7m0L6biQ1M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA4/MTQ1NTUzNC9waG90/by9pbmRpYW4tbW9u/ZXktYW5kLWJhbmtu/b3Rlcy01MDAtcnVw/ZWVzLWFuZC0yLTAw/MC1ydXBlZXMtYmFj/a2dyb3VuZC1vZi1w/YXBlci1pbmRpYW4t/bW9uZXkud2VicD9h/PTEmYj0xJnM9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXRLUU9ZLWlz/QjJleGJ0aG5iWnJ2/eDBlUlEzcTZNM1VJ/ZU9iUXhhY1VLOWc9" alt="" />
            <p className="text-sm text-blue-900 font-light bg-white rounded-md p-1 mt-1">hiii, shiva! how have you been</p>
            <span className="text-xs">1 min ago!</span>
          </div>
          <img className="w-8 h-8 rounded-2xl" src="./avatar.png" alt="" srcset="" />
        </div> 

       

        <div className="message w-[22rem] flex  gap-0 ">
          <img className="w-8 h-8 rounded-2xl" src="./avatar.png" alt="" srcset="" />
          <div className="texts flex flex-col  w-60   justify-center p-1">
            <p className="text-sm bg-blue-900 rounded-md p-1"> Lorem ipsum dolor sit, amet consectetur a officia onsequatur inventore ducimus m molestiae aliquam?</p>
            <span className="text-xs">1 min ago!</span>
          </div>
        </div>  
        <div ref={endRef}></div>
      </div>



      {/* Type And Send Section Start here */}
      <div className="bottom flex justify-between items-center p-2">
        <div className="icon flex gap-3"> 
          <img className="w-5 h-5" src="./img.png" alt="" srcset="" />
          <img className="w-5 h-5" src="./camera.png" alt="" srcset="" />
          <img className="w-5 h-5" src="./mic.png" alt="" srcset="" />
        </div>
        <input className=" chatInput w-[26rem] bg-transparent border-b border-none outline-none text-white rounded-[0.225rem] p-2 text-sm" type="text" name="" value={text} id=""  placeholder="Type a message....." onChange={(e)=> setText(e.target.value)}/>
        <div className="emoji">
          <img className="w-5 h-5"  src="./emoji.png" onClick={()=>setOpen((prev)=> !prev)} alt="" srcset="" />
          <div className="picker">

          <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="pl-2">Send</button>
      </div>

    </div>
  )
}

export default Chat