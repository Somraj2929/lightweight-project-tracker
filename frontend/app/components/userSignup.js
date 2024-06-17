"use client";
import React, { useState } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { EyeFilledIcon } from "./extraIcons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./extraIcons/EyeSlashFilledIcon";
import { teams, roles } from "@/public/signupdetails";
import Image from "next/image";
import Link from "next/link";

const UserSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSignup = () => {
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
      tempErrors.confirmPassword = "Passwords doesn't match";

    if (Object.keys(tempErrors).length === 0) {
      console.log({
        Name: name,
        Email: email,
        Team: team,
        Role: role,
        Password: password,
        confirmPassword: confirmPassword,
      });
      // Proceed with the signup process
    } else {
      setErrors(tempErrors);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-signup">
      <div className="md:w-[30vw]  w-full bg-white rounded-lg shadow-lg p-8 ">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={400}
          height={100}
          className="flex justify-center items-center mx-auto mb-2"
        />

        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <Input
          isRequired
          variant="underlined"
          type="text"
          label="Name"
          placeholder="Enter Your Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        <Input
          isRequired
          variant="underlined"
          type="email"
          name="email"
          label="Email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        <div className="flex justify-between gap-4 mb-4">
          <Select
            value={team}
            variant="underlined"
            name="team"
            label="Select Team"
            placeholder="Select a Team"
            onChange={setTeam}
            className="mb-4 w-full"
          >
            {teams.map((team) => (
              <SelectItem key={team.key} value={team.key}>
                {team.label}
              </SelectItem>
            ))}
          </Select>
          {errors.team && <p className="text-red-500 text-xs">{errors.team}</p>}
          <Select
            value={role}
            variant="underlined"
            name="role"
            label="Select Role"
            placeholder="Select a Role"
            onChange={setRole}
            className="mb-4 w-full"
          >
            {roles.map((role) => (
              <SelectItem key={role.key} value={role.key}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
        </div>
        <Input
          isRequired
          variant="underlined"
          name="password"
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
          className="mb-4"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
        <Input
          isRequired
          variant="underlined"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm Your Password"
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
          className="mb-4"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
        )}
        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Sign Up
        </button>
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
