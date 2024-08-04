"use client";
import React from "react";
import { Avatar, Tooltip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { fetchAllUsers } from "@/app/helper/apiHelpers";
import { useRef } from "react";
import { LuClipboardCopy } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";

const ChatData = ({ messages, user, chatId }) => {
  const [users, setUsers] = useState([]);
  const [copied, setCopied] = useState(false);
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
    const [datePart, timePart] = timestamp.split("T");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");

    const date = new Date(year, month - 1, day, hours, minutes);
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`; // DD MMM format
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // hh:mm A format

    return `${formattedDate} ${formattedTime}`;
  };

  const notify = () => toast("Copied to clipboard!", { type: "success" });

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(chatId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Hide the copied message after 2 seconds
        notify();
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const currentUserId = user.id;

  return (
    <div className="bg-custom md:w-[75%] w-full md:left-[25%] absolute h-full overflow-hidden">
      <div className="md:px-6 pt-4 px-2 h-auto ">
        <ToastContainer autoClose={700} />
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
          <h1 className="text-[35px] font-bold custom-heading">Live Chat</h1>
          <div className="md:flex items-center space-x-2 bg-blue-100 p-2 rounded-lg hidden">
            <pre className="font-semibold tracking-wider uppercase">
              {chatId}
            </pre>
            <Tooltip showArrow={true} content="Copy to Clipboard">
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              >
                <LuClipboardCopy />
              </button>
            </Tooltip>
          </div>
          <div className="flex md:p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
            <h3 className="text-lg hidden md:block font-semibold">
              {user.name}
            </h3>
            <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
          </div>
        </div>
        <div className="flex items-center justify-center md:hidden mt-2">
          <div className="flex w-auto space-x-2 bg-blue-100 p-2 rounded-lg">
            <pre className="font-semibold tracking-wider uppercase">
              {chatId}
            </pre>
            <Tooltip showArrow={true} content="Copy to Clipboard">
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              >
                <LuClipboardCopy />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="mt-7 sticky bg-pink-200 px-4 py-2 rounded-xl">
          <div className="flex flex-col md:h-[82vh] h-[84vh] md:pb-12 pb-[4.3rem]">
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
                        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-gray-200 bg-gray-100 rounded-e-xl ${
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
                        </div>
                        <p className="text-md font-normal md:py-1.5 py-1 text-gray-900 dark:text-white message-break">
                          {message.text}
                        </p>
                        <span className="flex justify-end text-xs font-normal text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
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
