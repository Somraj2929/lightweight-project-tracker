"use client";
import React, { useEffect } from "react";
import { fetchProjects } from "../helper/apiHelpers";
import SpinnerCustom from "./spinner";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@nextui-org/react";

const ProfileInfo = ({ user, onClose }) => {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [joiningMonth, setJoiningMonth] = React.useState("");
  const [joiningYear, setJoiningYear] = React.useState("");

  useEffect(() => {
    const loadCSS = (href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);

      return () => document.head.removeChild(link);
    };

    const removeFontAwesome = loadCSS(
      "https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
    );
    const removeTailwind = loadCSS(
      "https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
    );

    return () => {
      removeFontAwesome();
      removeTailwind();
    };
  }, []);

  const joiningMonthAndYear = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" }); // Get full month name, e.g., 'July'
    const year = date.getFullYear(); // Get year, e.g., '2024'
    return { month, year };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { month, year } = joiningMonthAndYear(user.createdAt);
        setJoiningMonth(month);
        setJoiningYear(year);
        const projectsData = await fetchProjects();
        setProjects(projectsData);
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
  const openProjects = filterProjects("open", 1);
  const inProgressProjects = filterProjects("inprogress", 1);
  const closedProjects = filterProjects("closed", 1);

  if (loading) {
    return (
      <>
        <SpinnerCustom />
      </>
    );
  }

  return (
    <div className="bg-custom-profile h-screen overflow-hidden">
      <div className="flex justify-between items-center pt-4 px-2">
        <Link href="/" className="md:hidden block">
          <Image
            src="/images/short-logo.svg"
            alt="logo"
            width={60}
            height={72}
            className="mix-blend-multiply"
          />
        </Link>
        <h1 className="md:text-[35px] text-[24px] font-bold  custom-heading">
          Profile Info
        </h1>
        <div className="flex md:p-2 rounded-lg gap-2 justify-center items-center bg-slate-400 ">
          <h3 className="hidden md:block text-lg font-semibold">{user.name}</h3>
          <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
        </div>
      </div>
      <main className="md:py-8 md:px-48  py-16">
        <section className="relative block md:h-[400px] h-[300px] rounded-lg mt-4">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover rounded-t-lg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black rounded-lg"
            ></span>
          </div>
        </section>
        <section className="relative py-8 bg-card-gradient rounded-b-lg">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full md:mb-6 shadow-xl rounded-lg -mt-56">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="..."
                        src={user.avatar}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center hidden md:block">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={onClose}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1 hidden  md:block">
                    <div className="flex justify-center py-4 lg:pt-4 pt-4">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {openProjects.length}
                        </span>
                        <span className="text-sm text-blueGray-400">Open</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {inProgressProjects.length}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          In-Progress
                        </span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {closedProjects.length}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-28 md:mt-0 mb-4">
                  <h3 className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2">
                    {user.name}
                  </h3>
                  <div className="text-sm leading-normal mt-0 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                    {user.role}
                  </div>
                  <div className="w-full lg:w-4/12 px-2 lg:order-1  block md:hidden">
                    <div className="flex justify-center py-4 pt-4">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {openProjects.length}
                        </span>
                        <span className="text-sm text-blueGray-400">Open</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {inProgressProjects.length}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          In-Progress
                        </span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {closedProjects.length}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-blueGray-600 mt-2">
                    <i className="fas fa-sitemap mr-2 text-lg text-blueGray-400"></i>
                    Team - {user.team}
                  </div>
                  <div className="mb-4 text-blueGray-600">
                    <i className="fas fa-globe mr-2 text-lg text-blueGray-400"></i>
                    Joined in {joiningMonth}, {joiningYear}
                  </div>

                  <div className="mt-6 block md:hidden">
                    <button
                      className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2  ease-linear transition-all duration-150"
                      type="button"
                      onClick={onClose}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfileInfo;
