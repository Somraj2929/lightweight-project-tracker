// pages/login.js
"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { EyeFilledIcon } from "./extraIcons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./extraIcons/EyeSlashFilledIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import { setCookie } from "../utils/cookies";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e) => {
    e.preventDefault();

    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    if (!password) tempErrors.password = "Password is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
    } else {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          const { token } = data;
          //setCookie("token", token);
          localStorage.setItem("token", token);
          router.push("/");
        } else if (response.status === 401) {
          setErrors({ form: "Invalid email or password" });
        } else {
          setErrors({ form: "Login failed. Please try again later." });
        }
      } catch (error) {
        console.error("Error logging in", error);
        setErrors({ form: "An error occurred while logging in." });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-signup">
      <div className="max-w-[26rem] w-auto bg-white rounded-lg shadow-lg p-8">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={400}
          height={100}
          className="flex justify-center items-center mx-auto m-4"
        />
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
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
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <Input
              isRequired
              variant="underlined"
              name="password"
              autoComplete="true"
              label="Password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="font-semibold input-font"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          {errors.form && (
            <p className="text-red-500 text-xs mt-1">{errors.form}</p>
          )}
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            Login
          </button>
          <p className="text-center mt-6">
            Don't have an account? &nbsp;
            <Link
              href="/users/signup"
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
