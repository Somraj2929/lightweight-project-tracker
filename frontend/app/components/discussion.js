"use client";
import React, { useState } from "react";
import { Avatar } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import chatHistory from "@/public/chat-data";

const Discussion = () => {
  const [chatid, setChatid] = useState("");
  const [error, setError] = useState("");

  const validateChatId = () => {
    const chatExists = chatHistory.some((chat) => chat.chatid === chatid);
    if (!chatExists) {
      setError("No Chat Room Found");
    } else {
      setError("");
      window.location.href = `/livechat/${chatid}`;
    }
  };

  const closeModal = () => {
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      validateChatId();
    }
  };

  return (
    <div className="flex">
      {/* Main Dashboard */}
      <div className="bg-custom w-[75%] left-[25%] absolute">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-bold custom-heading">Live Chat</h1>
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

          <div className="pt-6">
            <div className="flex justify-center ">
              <Image
                src="/images/start-chat.jpg"
                width={600}
                height={600}
                alt="chat"
                className="rounded-lg"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold leading-8 text-center pb-2">
                Create a Private Chat Room
              </h2>
              <div className="flex justify-between gap-16">
                <div className="w-[50%] border-1 rounded-lg p-4 bg-green-200">
                  <p className="text-center leading-10 font-semibold">
                    Already have a chat room? <br /> Enter the room code to join
                    the
                  </p>
                  <div className="flex justify-center gap-4">
                    <input
                      type="text"
                      placeholder="XXXX-1234-ZZZZ"
                      value={chatid}
                      onChange={(e) => setChatid(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-[50%] border rounded p-2 text-center tracking-wide font-semibold uppercase"
                    />
                    <button
                      onClick={validateChatId}
                      className="bg-blue-500 text-white py-2 px-4 rounded font-semibold"
                    >
                      Join Room
                    </button>
                  </div>
                </div>

                <div className="w-[50%] border-1 rounded-lg p-4 bg-green-200">
                  <p className="text-center leading-10 font-semibold">
                    Don't have a chat room? <br /> Create a new one now
                  </p>
                  <div className="flex justify-center gap-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded font-semibold">
                      Create Room
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
          <div className=" flex flex-col justify-center bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg text-center font-semibold mb-2">Oops🥲</h2>
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
  );
};

export default Discussion;
