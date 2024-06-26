"use client";
import Image from "next/image";
import { Avatar } from "@nextui-org/react";
import React from "react";
import BarChart from "./barchart";
import LineChart from "./linechart";
import MyProjects from "./myprojects";

const DashBoard = () => {
  return (
    <div className="flex">
      {/* Main Dashboard */}
      <div className="bg-custom w-[75%] left-[25%] absolute">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-bold custom-heading">Dashboard</h1>
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
          <div className="mt-7 flex justify-between text-black gap-4">
            <div className="flex w-full h-[6.5rem] bg-white rounded-[14px] items-center px-4">
              <Image src="/images/open.svg" width={85} height={85} alt="open" />
              <div className="px-4">
                <h2 className="text-xl font-semibold leading-8">
                  Open Projects
                </h2>
                <p className="text-4xl font-semibold">15</p>
              </div>
            </div>
            <div className="flex w-full h-[6.5rem] bg-white rounded-[14px] items-center px-4">
              <Image
                src="/images/inprogress.svg"
                width={85}
                height={85}
                alt="inprogress"
              />
              <div className="px-4">
                <h2 className="text-xl font-semibold leading-8">In Progress</h2>
                <p className="text-4xl font-semibold">8</p>
              </div>
            </div>
            <div className="flex w-full h-[6.5rem] bg-white rounded-[14px] items-center px-4">
              <Image
                src="/images/closed.svg"
                width={85}
                height={85}
                alt="closed"
              />
              <div className="px-4">
                <h2 className="text-xl font-semibold leading-8">Closed</h2>
                <p className="text-4xl font-semibold">23</p>
              </div>
            </div>
          </div>
          <div className="flex mt-4 justify-between gap-6">
            <div className="w-full h-auto bg-white rounded-[14px] px-4 py-2">
              <h3 className="text-lg font-semibold">Summary</h3>
              <BarChart />
            </div>
            <div className="w-full h-auto bg-white rounded-[14px] px-4 py-2">
              <div className="flex  justify-between">
                <h3 className="text-lg font-semibold">Monthly Report</h3>
                <span className="flex items-center">
                  <div className="w-[8px] h-[8px] bg-purple-600 rounded-full"></div>
                  <p className="text-sm font-light italic ml-2">
                    Number of Projects
                  </p>
                </span>
              </div>
              <LineChart />
            </div>
          </div>
          <div className="pt-4">
            <MyProjects />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
