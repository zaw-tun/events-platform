
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
        await setDoc(userRef, { name, role: "user" });
        navigate("/events");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-gray-600 mt-2">Join the community</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition w-full"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;