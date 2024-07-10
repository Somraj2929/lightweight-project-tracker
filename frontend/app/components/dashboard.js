"use client";
import Image from "next/image";
import { Avatar } from "@nextui-org/react";
import React from "react";
import BarChart from "./barchart";
import LineChart from "./linechart";
import MyProjects from "./myprojects";
import SidePanel from "./sidepanel";
import { useEffect } from "react";
import { fetchProjects } from "../helper/apiHelpers";
const DashBoard = ({ user }) => {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterProjects = (status, userId) => {
    return projects.filter((project) => {
      const isAssignedToUser =
        project.fromUserId === userId || project.toUserId === userId;
      return project.status === status && isAssignedToUser;
    });
  };
  const openProjects = filterProjects("open", user.id);
  const inProgressProjects = filterProjects("inprogress", user.id);
  const closedProjects = filterProjects("closed", user.id);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <SidePanel />

      {/* Main Dashboard */}
      <div className="bg-custom min-h-screen w-[75%] left-[25%] absolute">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-bold custom-heading">Dashboard</h1>
            <div className="flex p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
            </div>
          </div>
          <div className="mt-7 flex justify-between text-black gap-4">
            <div className="flex w-full h-[6.5rem] bg-white rounded-[14px] items-center px-4">
              <Image src="/images/open.svg" width={85} height={85} alt="open" />
              <div className="px-4">
                <h2 className="text-xl font-semibold leading-8">
                  Open Projects
                </h2>
                <p className="text-4xl font-semibold">{openProjects.length}</p>
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
                <p className="text-4xl font-semibold">
                  {inProgressProjects.length}
                </p>
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
                <p className="text-4xl font-semibold">
                  {closedProjects.length}
                </p>
              </div>
            </div>
          </div>
          <div className="flex mt-4 justify-between gap-6">
            <div className="w-full h-auto bg-white rounded-[14px] px-4 py-2">
              <h3 className="text-lg font-semibold">Summary</h3>
              <BarChart projects={projects} />
            </div>
            <div className="w-full h-auto bg-white rounded-[14px] px-4 py-2">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">Monthly Report</h3>
                <span className="flex items-center">
                  <div className="w-[8px] h-[8px] bg-purple-600 rounded-full"></div>
                  <p className="text-sm font-light italic ml-2">
                    Number of Projects
                  </p>
                </span>
              </div>
              <LineChart projects={projects} />
            </div>
          </div>
          <div className="pt-4">
            <MyProjects projects={projects} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
