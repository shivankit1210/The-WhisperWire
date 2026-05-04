import "./login.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../library/firebase";
import { doc, setDoc, query, collection, where } from "firebase/firestore";
import upload from "../../library/upload";
import { getDocs } from "firebase/firestore";
import { userStore } from "../../library/userStore";

const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Email/password signup is disabled in Firebase Authentication.";
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      return "Firebase API key is invalid. Check your .env file.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
};

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const { fetchUserInfo } = userStore();
  const isSignup = authMode === "signup";

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar((prev) => {
        if (prev.url.trim()) URL.revokeObjectURL(prev.url);
        return {
          file: e.target.files[0],
          url: URL.createObjectURL(e.target.files[0]),
        };
      });
    }
  };

  useEffect(() => {
    return () => {
      if (avatar.url.trim()) URL.revokeObjectURL(avatar.url);
    };
  }, [avatar.url]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password) {
      setLoading(false);
      return toast.warn("Please enter inputs!");
    }
    if (!avatar.file) {
      setLoading(false);
      return toast.warn("Please upload an avatar!");
    }
    if (password.length < 6) {
      setLoading(false);
      return toast.warn("Password should be at least 6 characters.");
    }

    //validate unique username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setLoading(false);
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

      await fetchUserInfo(res.user.uid);
      toast.success("Account Created Successfully !");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
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
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__glow login__glow--one"></div>
      <div className="login__glow login__glow--two"></div>

      <section className="login__intro" aria-label="The WhisperWire">
        <span className="login__eyebrow">The WhisperWire</span>
        <h1>Private chats with a little midnight shine.</h1>
        <p>
          Sign in to continue your conversations, or create a new account and
          join the wire.
        </p>
        <div className="login__signal" aria-hidden="true">
          <span className="login__ring login__ring--outer"></span>
          <span className="login__ring login__ring--middle"></span>
          <span className="login__ring login__ring--inner"></span>
          <span className="login__dot"></span>
          <span className="login__wave login__wave--one"></span>
          <span className="login__wave login__wave--two"></span>
          <span className="login__wave login__wave--three"></span>
        </div>
      </section>

      <div className="login__forms">
        <div className="login__card">
          <div className="login__tabs" role="tablist" aria-label="Authentication options">
            <button
              type="button"
              className={`login__tab ${isSignup ? "login__tab--active" : ""}`}
              aria-selected={isSignup}
              role="tab"
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={`login__tab ${!isSignup ? "login__tab--active" : ""}`}
              aria-selected={!isSignup}
              role="tab"
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
          </div>

          <span className="login__card-label">
            {isSignup ? "New here?" : "Existing account"}
          </span>
          <h2>{isSignup ? "Create an account" : "Welcome back"}</h2>

          <form
            className="login__form"
            action="submit"
            onSubmit={isSignup ? handleRegister : handleLogin}
          >
            {isSignup && (
              <>
                <label htmlFor="file" className="login__upload">
                  <span className="login__avatar-wrap">
                    <img
                      className="login__avatar"
                      src={avatar.url || "./avatar.png"}
                      alt="Selected avatar preview"
                    />
                  </span>
                  <span>
                    <strong>
                      {avatar.file ? "Change avatar" : "Upload avatar"}
                    </strong>
                    <small>
                      {avatar.file ? avatar.file.name : "PNG, JPG, or WEBP"}
                    </small>
                  </span>
                </label>

                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatar}
                />
                <input type="text" placeholder="Username" name="username" />
              </>
            )}
            <input type="email" placeholder="Email address" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button className="login__button" disabled={loading}>
              {!loading ? (isSignup ? "Create Account" : "Sign In") : "Loading..."}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
