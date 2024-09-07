"use client";
import React, { useState } from "react";
import { Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { EyeFilledIcon } from "./extraIcons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./extraIcons/EyeSlashFilledIcon";
import { teams, roles } from "@/public/signupdetails";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import { setCookie } from "../utils/cookies";

const UserSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const confirmtoggleVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return re.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSpinner(true);
    let tempErrors = {};

    if (!name) tempErrors.name = "Name is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!validateEmail(email)) tempErrors.email = "Invalid email format";
    if (!team) tempErrors.team = "Team is required";
    if (!role) tempErrors.role = "Role is required";
    if (!password) tempErrors.password = "Password is required";
    else if (!validatePassword(password))
      tempErrors.password =
        "Password must be at least 8 characters long and include uppercase letters, digits, and symbols";
    if (!confirmPassword)
      tempErrors.confirmPassword = "Confirm Password is required";
    else if (password !== confirmPassword)
      tempErrors.confirmPassword = "Passwords don't match";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      setSpinner(false);
    } else {
      try {
        // Trigger the Simple Analytics event
        if (typeof window !== "undefined" && window.sa_event) {
          window.sa_event("signup-attempt", {
            name,
            email,
            team,
            role,
          });
        }

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, team, role, password }),
        });

        const data = await response.json();
        if (response.ok) {
          const { token } = data;
          //setCookie("token", token);
          localStorage.setItem("token", token);
          router.push("/");
        } else {
          if (response.status === 400) {
            alert("User already exists. Please login with your credentials.");
            router.push("/users/login");
          } else {
            setErrors({ form: `Signup failed: ${data.message}` });
          }
        }
      } catch (error) {
        console.error("Error signing up", error);
        setErrors({
          form: `An error occurred while signing up: ${error.message}`,
        });
      } finally {
        setSpinner(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-signup">
      <div className="max-w-[30rem] w-full bg-white rounded-lg shadow-lg p-8">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={400}
          height={100}
          className="flex justify-center items-center mx-auto m-4"
        />
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <Input
              isRequired
              variant="underlined"
              name="name"
              label="Name"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                const formattedValue = value
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase());
                setName(formattedValue);
              }}
              className="font-semibold input-font"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
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
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className="font-semibold input-font"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex justify-between gap-4">
            <div className="mb-4 w-full">
              <Select
                isRequired
                label="Select Team"
                placeholder="Select Your Team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              >
                {teams.map((team) => (
                  <SelectItem key={team.key} value={team.key}>
                    {team.label}
                  </SelectItem>
                ))}
              </Select>
              {errors.team && (
                <p className="text-red-500 text-xs mt-1">{errors.team}</p>
              )}
            </div>
            <div className="mb-4 w-full">
              <Select
                isRequired
                label="Select Role"
                placeholder="Select Your Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roles.map((role) => (
                  <SelectItem key={role.key} value={role.key}>
                    {role.label}
                  </SelectItem>
                ))}
              </Select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>
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
          <div className="mb-4">
            <Input
              isRequired
              variant="underlined"
              name="confirmPassword"
              autoComplete="true"
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={confirmtoggleVisibility}
                >
                  {isConfirmVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isConfirmVisible ? "text" : "password"}
              className="font-semibold input-font"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          {errors.form && (
            <p className="text-red-500 text-xs mt-1">{errors.form}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 flex justify-center items-center"
            disabled={spinner}
          >
            {spinner ? <Spinner size="sm" className="mr-2" /> : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-6">
          Already have an account? &nbsp;
          <Link href="/users/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
