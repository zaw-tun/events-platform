import React, { useState } from "react";
import { logIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await logIn(email, password);
    if (result.success) {
      navigate("/events");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="">
      <h2 className="">Log In</h2>
      {error && <p className="">{error}</p>}
      <form onSubmit={handleLogin} className="">
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
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
