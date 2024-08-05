"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("Invalid email format");
      return;
    }
    // Make an API call to request a password reset
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Check your email for the password reset link.");
    } else {
      setMessage("Error requesting password reset.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-signup">
      <div className="md:max-w-[26rem] w-auto max-w-[22rem] bg-white rounded-lg shadow-lg p-8">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={400}
          height={100}
          className="flex justify-center items-center mx-auto m-4"
        />
        <h2 className="text-2xl font-bold text-center mb-4">Send Reset Link</h2>
        <form>
          <div className="mb-4">
            <Input
              isRequired
              variant="underlined"
              type="email"
              autoComplete="true"
              name="email"
              label="Email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-semibold input-font"
            />
          </div>
          {message && <p className="text-red-500 text-xs mb-2">{message}</p>}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            Send Password Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
