import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { useState } from "react";

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const handleGoogleClick = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      //   console.log(result);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profileImg: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
      setError(error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        className="bg-slate-200 flex gap-2 justify-center items-center text-black p-3 rounded-lg  hover:opacity-95"
      >
        Continue with{" "}
        <span className="flex items-center font-semibold">
          <FcGoogle /> oogle
        </span>
      </button>
      {error && (
        <span className="text-red-600 text-xs">
          could not sign in with google,{error}
        </span>
      )}
    </>
  );
}
