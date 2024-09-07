"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@nextui-org/react";
import Image from "next/image";

const ResetPasswordComponent = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const trackCustomEvent = (eventName, eventData) => {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(eventName, eventData);
    }
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setMessage("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    if (!validatePassword(password)) {
      setMessage(
        "Password must be at least 8 characters long and include uppercase letters, digits, and symbols"
      );
      return;
    }
    console.log("token", token);
    trackCustomEvent("reset-password", { message: "Password reset attempt" });
    // Make an API call to reset the password
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setMessage(
        "Password reset successful. You can now log in with your new password."
      );
      router.push("/users/login");
    } else {
      setMessage("Error resetting password.");
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
        <h2 className="text-2xl font-bold text-center mb-4">
          Enter New Password
        </h2>
        <form>
          <div className="mb-4">
            <Input
              isRequired
              variant="underlined"
              type="password"
              name="password"
              label="Enter Password"
              placeholder="Enter Your New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-semibold input-font"
            />
          </div>
          <div className="mb-4">
            <Input
              isRequired
              variant="underlined"
              type="password"
              name="confirmPassword"
              label="Enter Password Again"
              placeholder="Enter Your New Password Again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="font-semibold input-font"
            />
          </div>
          {message && <p className="text-red-500 text-xs mb-2">{message}</p>}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPassword = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordComponent />
  </Suspense>
);

export default ResetPassword;
