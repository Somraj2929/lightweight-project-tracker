"use client";
import SidePanel from "@/app/components/sidepanel";
import ChatData from "@/app/components/chatdata";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import chatHistory from "@/public/chat-data";

const LiveChatData = () => {
  const { chatId } = useParams();

  const messagesData = JSON.parse(JSON.stringify(chatHistory));
  function getMessages(chatid) {
    const chat = messagesData.find((chat) => chat.chatid === chatid);
    return chat ? chat["message-data"] : [];
  }

  useEffect(() => {
    if (chatId) {
      const fetchedMessages = getMessages(chatId);
      console.log("Fetched Messages:", fetchedMessages);
    }
  }, [chatId]);

  const message = getMessages(chatId);

  return (
    <>
      <SidePanel />

      {chatId ? <ChatData messages={message} /> : <p>Loading...</p>}
    </>
  );
};

export default LiveChatData;
