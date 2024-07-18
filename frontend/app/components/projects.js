"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import SidePanel from "./sidepanel";

import AllProjectsData from "./allprojectdata";

const AllProjects = ({ user }) => {
  return (
    <div className="flex">
      <SidePanel currentUser={user} />
      <div className="bg-pink-200 min-h-screen w-[75%] left-[25%] absolute">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-bold custom-heading">Projects</h1>
            <div className="flex p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
            </div>
          </div>
          <div className="mt-7">
            <AllProjectsData />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
