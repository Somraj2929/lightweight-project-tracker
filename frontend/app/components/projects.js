import React from "react";
import Image from "next/image";
import { Avatar } from "@nextui-org/react";

import AllProjectsData from "./allprojectdata";

const AllProjects = () => {
  return (
    <div className="flex">
      <div className="bg-pink-200 min-h-screen w-[75%] left-[25%] absolute">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-bold custom-heading">Projects</h1>
            <div className="flex p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="text-lg font-semibold">Somraj Bishnoi</h3>
              <Avatar
                isBordered
                radius="sm"
                src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                size="sm"
              />
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
