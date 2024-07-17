"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { fetchAllUsers } from "@/app/helper/apiHelpers";
import { useRef } from "react";

const ChatData = ({ messages, user, chatId }) => {
  const [users, setUsers] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchAllUsers();
      const userMap = response.reduce((acc, curr) => {
        acc[curr.id] = curr; // Create a map for efficient user lookup
        return acc;
      }, {});
      setUsers(userMap);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    const formattedTime = new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime.toUpperCase();
  };

  const currentUserId = user.id;

  return (
    <div className="bg-custom w-[75%] left-[25%] absolute h-screen">
      <div className="px-6 pt-4 ">
        <div className="flex justify-between items-center">
          <h1 className="text-[35px] font-bold custom-heading">Live Chat</h1>
          <h3 className="font-semibold tracking-wider uppercase">{chatId}</h3>
          <div className="flex p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
          </div>
        </div>
        <div className="mt-7 sticky bg-pink-200 px-4 py-2 rounded-xl">
          <div className="flex flex-col h-[82vh] pb-12">
            <div
              className="overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
              ref={chatContainerRef}
            >
              {messages.map((message) => {
                const currentMessageUserId = message.userId;
                const userDetails = users[currentMessageUserId]; // Lookup user by ID

                if (!userDetails) {
                  return null;
                }
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
                          className={`flex items-center space-x-2 justify-between ${
                            isCurrentUser ? "rtl:space-x-reverse" : ""
                          }`}
                        >
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {userDetails.name}
                          </span>
                          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-md font-normal pt-2.5 text-gray-900 dark:text-white message-break">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatData;
