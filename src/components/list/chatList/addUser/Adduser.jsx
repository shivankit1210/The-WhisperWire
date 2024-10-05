import React from "react";
import "./Adduser.css";

const Adduser = () => {
  return (
    <div className="addUser flex flex-col p-5 text-black">
      <form action="" className="flex flex-row gap-x-5">
        <input className="bg-white p-1 w-52 rounded-md" type="text" placeholder="Username" name="username" />
        <button id="search" className="p-1 w-14 bg-blue-500 border-none">Search</button>
      </form>
      <div className="user flex justify-between items-center p-1 ">
        <div className="detail flex p-1 place-content-center items-center bg-white w-96 my-2 rounded-md gap-x-3">
          <img className="w-5 h-5 rounded-full" src="./avatar.png" alt="" />
          <span className="">  Shobhit Agarwal</span>
        </div>
        <button className="p-1 w-14 bg-blue-500 border-none text-xs">Add</button>
      </div>
    </div>
  );
};

export default Adduser;
