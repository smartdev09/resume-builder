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
    <div className="min-h-screen bg-gray-50">
 

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Build your professional<br />
            resume in minutes.
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-12">
            If a sheet of paper represents your entire work life, 
            personality, and skills, it better be a pretty amazing piece of 
            paper — Let us do the heavy lifting.
          </p>
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Get Started
          </h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSignup}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                SIGN UP
              </button>
              <button
                onClick={handleLogin}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Choose from 7 templates
          </p>
        </div>

      

          {/* Testimonials */}
          

          
        </div>
      </div>
    
  );
}