"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { EyeFilledIcon } from "./extraIcons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./extraIcons/EyeSlashFilledIcon";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    console.log();
    if (!password) tempErrors.password = "Password is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
    } else {
      console.log({
        Email: email,
        Password: password,
      });

      // Implement login logic here
      // This could involve sending a POST request to your server-side API
      // with email and password for validation

      // Clear form data after successful login
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-signup">
      <div className="md:w-[26vw] w-full bg-white rounded-lg shadow-lg p-8">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={400}
          height={100}
          className="flex justify-center items-center mx-auto m-4"
        />
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

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
        <button
          type="submit"
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Login
        </button>
        <p className="text-center mt-6">
          Don't have an account? &nbsp;
          <Link href="/users/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
