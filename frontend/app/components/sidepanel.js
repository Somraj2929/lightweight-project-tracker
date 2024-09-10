import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { useState } from "react";
import ProfilePictureUpload from "./avatarUpdate";
import { TbLogout } from "react-icons/tb";
import { GrFormEdit } from "react-icons/gr";
import { MdCancel } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

const SidePanel = ({ currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const trackCustomEvent = (eventName, eventData) => {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(eventName, eventData);
    }
  };

  const tabClick = (tab, currentUser) => {
    return () => {
      switch (tab) {
        case "dashboard":
          trackCustomEvent("dashboard_tab", { userId: currentUser.id });
          break;
        case "projects":
          trackCustomEvent("projects_tab", { userId: currentUser.id });
          break;
        case "livechat":
          trackCustomEvent("livechat_tab", { userId: currentUser.id });
          break;
        default:
          console.warn("Unknown tab:", tab);
          break;
      }
    };
  };

  const handleLogout = () => {
    trackCustomEvent("logout", { userId: currentUser.id });
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleEditProfilePic = () => {
    trackCustomEvent("edit-profile-pic", { userId: currentUser.id });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleSidePanel = () => {
    trackCustomEvent("toggle-side-panel", { userId: currentUser.id });
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 w-[80%]  bg-white z-10 transform ${
          isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:w-[25%] md:block md:border-r-2`}
      >
        <div className="p-6 border-b-2 flex justify-between items-center">
          <Image src="/images/logo.svg" alt="logo" width={335} height={52} />
        </div>

        <div className="flex flex-col py-4 px-10 gap-6 item-center justify-center">
          <Link href="/" onClick={tabClick("dashboard", currentUser)}>
            <button className="py-2 rounded-xl bg-blue-700 flex items-center justify-center gap-4 w-[100%]">
              <span>
                <Image
                  src="/images/dashboardactive.svg"
                  alt="home"
                  width={25}
                  height={25}
                />
              </span>
              <span className="text-white text-2xl font-medium">Dashboard</span>
            </button>
          </Link>
          <Link href="/projects" onClick={tabClick("projects", currentUser)}>
            <button className="py-2 rounded-xl bg-pink-700 flex items-center justify-center gap-4 w-[100%]">
              <span>
                <Image
                  src="/images/projectactive.svg"
                  alt="projects"
                  width={25}
                  height={25}
                />
              </span>
              <span className="text-white text-2xl font-medium">Projects</span>
            </button>
          </Link>
          <Link href="/livechat" onClick={tabClick("livechat", currentUser)}>
            <button className="py-2 rounded-xl bg-red-700 flex items-center justify-center gap-4 w-[100%]">
              <span>
                <Image
                  src="/images/chatactive.svg"
                  alt="Chat"
                  width={25}
                  height={25}
                />
              </span>
              <span className="text-white text-2xl font-medium">
                Discussion
              </span>
            </button>
          </Link>
        </div>
        <div className="fixed bottom-0 w-full">
          <div className="flex flex-col justify-between items-center mt-auto">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden relative">
                <Image
                  src={currentUser.avatar}
                  alt="profile picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <span
                className="absolute bottom-0 right-0 bg-blue-200 rounded-full cursor-pointer"
                onClick={handleEditProfilePic}
              >
                <GrFormEdit className="w-8 h-8" />
              </span>
            </div>
            <div className="flex w-full justify-center border-y-2 p-2">
              <span className="flex w-[90%] justify-center text-lg font-bold items-center border-r-2">
                {currentUser.name}
              </span>
              <div className="flex justify-end items-center pl-2">
                <button onClick={handleLogout}>
                  <TbLogout className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed left-0 inset-0 bg-black bg-opacity-50 flex items-center p-4 z-50">
            <div className="bg-white w-full p-4 rounded-lg shadow-lg z-10">
              <ProfilePictureUpload user={currentUser} />
              <div className="flex justify-center items-center">
                <button
                  onClick={closeModal}
                  className="mt-4 bg-red-500 text-white p-1 rounded-full"
                >
                  <MdCancel className="h-8 w-8" />
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Close button inside the sidebar */}
        {isSidePanelOpen && (
          <div
            className="absolute top-1/2 right-[0px] transform -translate-y-1/2 bg-white border-l-2 p-2 cursor-pointer"
            onClick={toggleSidePanel}
          >
            <TbLayoutSidebarLeftCollapse className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Swippable icon for opening the side panel */}
      {!isSidePanelOpen && (
        <div
          className="fixed top-1/2 left-[-12px] z-50 transform -translate-y-1/2 bg-yellow-100 border-r-2 cursor-pointer md:hidden rounded-lg"
          onClick={toggleSidePanel}
        >
          <TbLayoutSidebarLeftExpand className="h-16 w-8" />
        </div>
      )}
    </>
  );
};

export default SidePanel;
