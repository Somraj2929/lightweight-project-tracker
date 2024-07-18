"use client";
import Image from "next/image";
import Link from "next/link";
import { TbLogout } from "react-icons/tb";
import { GrFormEdit } from "react-icons/gr";
import { useRouter } from "next/navigation";

const SidePanel = ({ currentUser }) => {
  const router = useRouter();
  const isEditingProfilePicture = true;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleEditProfilePic = () => {
    console.log("Edit profile picture");
  };

  return (
    <div className="w-[25%] h-screen bg-white fixed border-r-2">
      <div className="p-6 border-b-2">
        <Image src="/images/logo.svg" alt="logo" width={335} height={52} />
      </div>

      <div className="flex flex-col py-4 px-10 gap-6 item-center justify-center">
        <Link href="/">
          <button className=" py-2 rounded-xl bg-blue-700 flex items-center justify-center gap-4 w-[100%]">
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
        <Link href="/projects">
          <button className=" py-2 rounded-xl bg-pink-700 flex items-center justify-center gap-4 w-[100%]">
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
        <Link href="/livechat">
          <button className=" py-2 rounded-xl bg-red-700 flex items-center justify-center gap-4 w-[100%]">
            <span>
              <Image
                src="/images/chatactive.svg"
                alt="Chat"
                width={25}
                height={25}
              />
            </span>
            <span className="text-white text-2xl font-medium">Discussion</span>
          </button>
        </Link>
      </div>
      <div className="fixed bottom-0 w-[25%]">
        <div className="flex flex-col justify-between items-center mt-auto">
          <div className="relative">
            <Image
              src={currentUser.avatar}
              alt="profile picture"
              width={100}
              height={100}
              className="rounded-full"
            />
            {isEditingProfilePicture && (
              <div>
                <span className="absolute bottom-0 right-0 bg-blue-200 rounded-full">
                  <GrFormEdit className="w-8 h-8" />
                </span>
              </div>
            )}
          </div>
          <div className="flex w-full justify-center border-y-2  p-2">
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
    </div>
  );
};

export default SidePanel;
