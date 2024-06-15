"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import { getUserDetailsById } from "./helpers";

const ChatData = ({ messages }) => {
  const formatTime = (timestamp) => {
    const formattedTime = new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime.toUpperCase();
  };

  const currentUserId = 3;

  return (
    <div className="bg-custom w-[75%] left-[25%] absolute h-screen">
      <div className="px-6 pt-4 ">
        <div className="flex justify-between items-center">
          <h1 className="text-[35px] font-bold custom-heading">Live Chat</h1>
          <h3 className="font-semibold tracking-wider">XXXX-1234-ZZZZ</h3>
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
        <div className="mt-7 sticky bg-pink-200 px-4 py-2 rounded-xl">
          <div className="flex flex-col h-[80vh]">
            <div className="overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {messages.map((message) => {
                const userDetails = getUserDetailsById(message.userId);
                const isCurrentUser = message.userId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col mb-2 ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`flex ${
                        isCurrentUser
                          ? "flex-row-reverse justify-end"
                          : "justify-start"
                      } gap-2.5`}
                    >
                      <img
                        className="w-8 h-8 rounded-full"
                        src={userDetails.avatar}
                        alt={`${userDetails.name} avatar`}
                      />
                      <div
                        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl ${
                          isCurrentUser
                            ? "rounded-xl rounded-tr-none"
                            : "rounded-es-xl"
                        } dark:bg-gray-700`}
                      >
                        <div
                          className={`flex items-center space-x-2 ${
                            isCurrentUser ? "rtl:space-x-reverse" : ""
                          }`}
                        >
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {userDetails.name}
                          </span>
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="fixed w-[70%] top-[87%] border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatData;
