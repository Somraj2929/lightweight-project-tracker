import React from "react";
import { Avatar } from "@nextui-org/react";

const ChatData = () => {
  const messages = [
    { id: 1, text: "Hello!", timestamp: "12:00 PM" },
    { id: 2, text: "Hi there!", timestamp: "12:05 PM" },
    { id: 3, text: "How are you?", timestamp: "12:10 PM" },
    { id: 4, text: "I'm good, thanks!", timestamp: "12:15 PM" },
    { id: 5, text: "What about you?", timestamp: "12:20 PM" },
    { id: 6, text: "I'm doing great!", timestamp: "12:25 PM" },
    { id: 7, text: "That's awesome!", timestamp: "12:30 PM" },
    { id: 8, text: "Yes, it is!", timestamp: "12:35 PM" },
    { id: 9, text: "I'm glad to hear that!", timestamp: "12:40 PM" },
    { id: 10, text: "Thanks!", timestamp: "12:45 PM" },
    // Add more messages as needed
  ];
  return (
    <div className="bg-custom w-[75%] left-[25%] absolute h-screen">
      <div className="px-6 pt-4 ">
        <div className="flex justify-between items-center">
          <h1 className="text-[35px] font-bold custom-heading">Add Project</h1>
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
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col mb-2">
                  <div className="bg-gray-200 rounded p-2 max-w-[fit-content]">
                    {message.text}
                  </div>
                  <span className="text-gray-600 text-xs ml-1">
                    {message.timestamp}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-[90%] border rounded p-2"
              />
              <button className=" bg-blue-500 text-white py-2 px-4 rounded">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatData;
