import React, { useState } from "react";
import { signUp } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const result = await signUp(email, password);

      if (result.success) {
        const userRef = doc(db, "users", result.user.uid);
        await setDoc(userRef, { name });

        navigate("/events");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occured. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-yellow-50 p-6">
      <h2 className="text-2xl font-bold text-black mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form
        onSubmit={handleSignUp}
        className="flex flex-col w-full gap-4 max-w-md"
      >
        <input
          type="text"
          placeholder="First Name"
          className="p-2 border w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 w-full rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
