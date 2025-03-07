import React, { useState } from "react";
import { signUp } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("Sign-up started:", { email, password });

    try {
      const result = await signUp(email, password);
      console.log("Sign-up result:", result);

      if (result.success) {
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
    <div className="">
      <h2 className="">Sign Up</h2>
      {error && <p className="">{error}</p>}
      <form onSubmit={handleSignUp} className="">
        <input
          type="email"
          placeholder="Email"
          className=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
