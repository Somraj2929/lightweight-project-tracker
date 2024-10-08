"use client";
import Image from "next/image";
import { Avatar } from "@nextui-org/react";
import React from "react";
import BarChart from "./barchart";
import LineChart from "./linechart";
import MyProjects from "./myprojects";
import SidePanel from "./sidepanel";
import { useEffect } from "react";
import { fetchProjects, fetchAllUsers } from "../helper/apiHelpers";
import SpinnerCustom from "./spinner";
import Link from "next/link";
import ProfileInfo from "./profileInfo";

const DashBoard = ({ user }) => {
  const [users, setUsers] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [openProfile, setOpenProfile] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, usersData] = await Promise.all([
          fetchProjects(),
          fetchAllUsers(),
        ]);
        setProjects(projectsData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(true);
        window.location.reload();
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

  const openUserProfile = () => {
    setOpenProfile(!openProfile);
  };

  if (loading) {
    return (
      <>
        <SpinnerCustom />
      </>
    );
  }

  return (
    <div>
      {openProfile ? (
        <ProfileInfo user={user} onClose={() => setOpenProfile(false)} />
      ) : (
        <div>
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
                  Dashboard
                </h1>
                <div
                  className="flex md:p-2 rounded-lg gap-2 justify-center items-center bg-slate-400 "
                  onClick={openUserProfile}
                >
                  <h3 className="hidden md:block text-lg font-semibold">
                    {user.name}
                  </h3>
                  <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
                </div>
              </div>
              <div className="mt-7 flex flex-col md:flex-row justify-between text-black gap-4">
                <div className="flex w-full h-[6.5rem] bg-white rounded-[14px] items-center px-4">
                  <Image
                    src="/images/open.svg"
                    width={85}
                    height={85}
                    alt="open"
                  />
                  <div className="px-4">
                    <h2 className="text-xl font-semibold leading-8">
                      Open Projects
                    </h2>
                    <p className="text-4xl font-semibold">
                      {openProjects.length}
                    </p>
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
                    <h2 className="text-xl font-semibold leading-8">
                      In Progress
                    </h2>
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
              <div className="flex mt-4 flex-col md:flex-row justify-between gap-6">
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
              <div className="pt-4 w-auto">
                <MyProjects projects={projects} user={user} users={users} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
