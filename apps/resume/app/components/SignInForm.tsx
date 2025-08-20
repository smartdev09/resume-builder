"use client";

import React, { useState } from "react";
import { login, signup } from "./actions"; 
// ⬆ Replace with your actual server action imports

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await login(formData);
  };

  const handleSignup = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await signup(formData);
  };

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto p-4 border rounded">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 rounded"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
