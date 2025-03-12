import "./login.css";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../library/firebase";
import { doc, setDoc, query, collection, where } from "firebase/firestore";
import upload from "../../library/upload";
import { getDocs } from "firebase/firestore";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: " ",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    console.log("clicked")
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    //validate unique username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account Created Successfully !");
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("You are Signing In...");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login flex flex-col gap-y-10  md:flex md:gap-x-72  justify-evenly items-center  w-[100%] relative">
      {/* Form section for login start here */}
      <div className="rounded-full bg-blue-300 animate-pulse md:w-5 md:h-5 absolute md:right-3 md:top-3 right-3 top-5"></div>

      <div className="item h-[30%] w-[65%] md:w-[30%] md:h-[40%] gap-y-5   md:absolute md:top-26 md:left-[10rem]  md:p-10 md:gap-y-3 ">
        <h1 className="text-xl font-black">Welcome back</h1>
        <form
          className="  gap-5 md:gap-y-5"
          action="submit"
          onSubmit={handleLogin}
        >
          <input type="text" placeholder="Enter Your Email" name="email" />
          <input
            type="password"
            placeholder="Enter Your Password"
            name="password"
          />
          <button disabled={loading}>
            {!loading ? "Sign In" : "Loading..."}
          </button>
        </form>
      </div>

      {/* Separator class */}

      <div className="separator hidden md:block md:h-[80%] md:w-[0.01rem] bg-gray-300"></div>

      {/* Input section for signup start here */}

      <div className="item w-[65%] h-[45%] md:w-[30%] md:h-[60%] md:absolute  md:top-28 md:left-[800px] md:right-[9rem] p-5 md:p-10  md:gap-y-3">
        <h1 className="text-xl font-black">Create an Account!</h1>
        <form
          className="gap-y-5"
          action="submit"
          onSubmit={handleRegister}
        >
          <label htmlFor="file" className="text-green-500 bg-gray-500  rounded-md p-1 font-semibold relative ">
            <img className=" outline-none border-0 rounded-full absolute top-[-7.0rem] bg-transparent left-[2.5rem] w-16 h-16 " src={avatar.url || "./avatar.png"} alt="" style={{ background: "transparent" }} />
            Upload an Image
          </label>
          

          <input
            id="file"
            className=""
            type="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input
          className=""
            type="text"
            placeholder="Enter new Username..."
            name="username"
          />
          <input type="text" placeholder="Enter Your Email..." name="email" />
          <input
            type="password"
            placeholder="Enter New password..."
            name="password"
          />
          <button disabled={loading}>
            {!loading ? "Sign Up" : "Loading..."}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
