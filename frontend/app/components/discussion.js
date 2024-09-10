"use client";
import React, { useState } from "react";
import { Avatar, Spinner } from "@nextui-org/react";
import Image from "next/image";
import SidePanel from "./sidepanel";
import { validateChatId, createChatRoom } from "../helper/apiHelpers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileInfo from "./profileInfo";

const Discussion = ({ user }) => {
  const router = useRouter();
  const [chatid, setChatid] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false); // State for Join Room spinner
  const [isCreating, setIsCreating] = useState(false); // State for Create Room spinner
  const [openProfile, setOpenProfile] = useState(false);

  const trackCustomEvent = (eventName, eventData) => {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(eventName, eventData);
    }
  };

  const handleValidateChatId = async () => {
    trackCustomEvent("chat-room-join-attempt", { userId: user.id });
    setIsJoining(true); // Start spinner for joining
    const response = await validateChatId(chatid);
    console.log(response);

    if (response === null) {
      setError("No Chat Room Found or Chat Room is Closed");
    } else {
      setError("");
      router.push(`/livechat/${chatid}`);
    }
    setIsJoining(false); // Stop spinner after join attempt
  };

  const handleCreateChatRoom = async () => {
    trackCustomEvent("chat-room-create", { userId: user.id });
    setIsCreating(true); // Start spinner for creating
    const response = await createChatRoom(user.id);

    if (response.error) {
      setError(response.error);
    } else {
      setError("");
      router.push(`/livechat/${response.chatID}`);
    }
    setIsCreating(false); // Stop spinner after create attempt
  };

  const closeModal = () => {
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleValidateChatId();
    }
  };

  const openUserProfile = () => {
    setOpenProfile(!openProfile);
  };

  return (
    <div>
      {openProfile ? (
        <ProfileInfo user={user} onClose={() => setOpenProfile(false)} />
      ) : (
        <div className="flex ">
          <SidePanel currentUser={user} />
          <div className="bg-custom md:w-[75%] md:left-[25%] w-full absolute h-auto">
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
                  Live Chat
                </h1>
                <div
                  className="flex md:p-2 rounded-lg gap-2 justify-center items-center bg-slate-400"
                  onClick={openUserProfile}
                >
                  <h3 className="text-lg hidden md:block font-semibold">
                    {user.name}
                  </h3>
                  <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
                </div>
              </div>

              <div className="pt-6">
                <div className="flex justify-center">
                  <Image
                    src="/images/start-chat.jpg"
                    width={600}
                    height={600}
                    alt="chat"
                    className="rounded-lg"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold leading-8 text-center md:pb-2 py-8 md:pt-2">
                    Create a Private Chat Room
                  </h2>
                  <div className="flex flex-col md:flex-row justify-between md:gap-16 gap-4">
                    <div className="md:w-[50%] border-1 rounded-lg p-4 bg-green-200">
                      <p className="text-center leading-10 font-semibold">
                        Already have a chat room? <br /> Enter the room code to
                        join
                      </p>
                      <div className="flex justify-center gap-4">
                        <input
                          type="text"
                          placeholder="2024-XYZA-1234"
                          value={chatid}
                          onChange={(e) =>
                            setChatid(e.target.value.toLowerCase())
                          }
                          onKeyDown={handleKeyDown}
                          className="w-[50%] border rounded p-2 text-center tracking-wide font-semibold uppercase"
                        />
                        <button
                          onClick={handleValidateChatId}
                          className="bg-blue-500 text-white py-2 px-4 rounded font-semibold w-[30%]"
                          disabled={isJoining}
                        >
                          {isJoining ? (
                            <Spinner size="sm" color="white" />
                          ) : (
                            "Join Room"
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="md:w-[50%] border-1 rounded-lg p-4 bg-green-200">
                      <p className="text-center leading-10 font-semibold">
                        Don't have a chat room? <br /> Create a new one now
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handleCreateChatRoom}
                          className="bg-blue-500 text-white py-2 px-4 rounded font-semibold w-[40%]"
                          disabled={isCreating}
                        >
                          {isCreating ? (
                            <Spinner size="sm" color="white" />
                          ) : (
                            "Create Room"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="flex flex-col justify-center bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg text-center font-semibold mb-2">
                  Oops🥲
                </h2>
                <p>{error}</p>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discussion;
