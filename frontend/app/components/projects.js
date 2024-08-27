"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import SidePanel from "./sidepanel";
import Image from "next/image";
import Link from "next/link";

import AllProjectsData from "./allprojectdata";

const AllProjects = ({ user }) => {
  return (
    <div className="flex ">
      <SidePanel currentUser={user} />
      <div className="bg-custom min-h-screen md:w-[75%] md:left-[25%] absolute w-full">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="md:hidden block">
              <Image
                src="/images/short-logo.svg"
                alt="logo"
                width={60}
                height={72}
                className="mix-blend-multiply"
              />
            </Link>
            <h1 className="md:text-[35px] text-[24px] font-bold custom-heading">
              Projects
            </h1>
            <div className="flex md:p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="hidden md:block text-lg font-semibold">
                {user.name}
              </h3>
              <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
            </div>
          </div>
          <div className="mt-7 w-auto">
            <AllProjectsData currentUser={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
