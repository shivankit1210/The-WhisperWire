import "./login.css";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: " ",
  });

  const handleAvatar = e => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };


  const handleLogin = e =>{
  e.preventDefault()
  toast.success("you are Loggin In!")
  }

  return (
    <div className="login  flex gap-x-72 justify-evenly items-center  w-[100%] relative">

        {/* Form section for login start here */}

      <div className="item  absolute top-26 left-[10rem] p-10 gap-y-3 ">
        <h1 className="text-xl font-black">Welcome back,</h1>
        <form className="gap-y-5" action="submit" onSubmit={handleLogin} >
          <input type="text"  placeholder="Enter Your Email" name="email" />
          <input type="password" placeholder="Enter Your Password" name="email" />
          <button>Sign In</button>
        </form>
      </div>

         {/* Separator class */}

      <div className="separator h-[80%] w-[0.01rem] bg-gray-300"></div>

          {/* Input section start here */}

      <div className="item  absolute top-26 right-[9rem] p-10 gap-y-3">
        <h1 className="text-xl font-black">Create an Account!</h1>
        <form className="gap-y-5 relative" action="submit">
          <label htmlFor="file" className="text-green-500 bg-gray-500 rounded-md p-1 font-semibold hover:cursor-pointer ">
            <img className="rounded-full absolute top-[-7.0rem] left-[5.5rem] w-16 h-16 " src={avatar.url || "./avatar.png"} alt="" />
            Upload an Image
          </label>

          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Enter New Username..." name="email" />
          <input type="text" placeholder="Enter Your Email..." name="email" />
          <input type="password" placeholder="Enter New password..." name="email" />
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
