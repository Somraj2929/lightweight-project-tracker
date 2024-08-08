"use client";
import SidePanel from "@/app/components/sidepanel";
import ChatData from "@/app/components/chatdata";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMessagesByChatId } from "@/app/helper/apiHelpers"; // Import the fetch function

import withAuth from "@/app/hooks/withAuth";

function LiveChatData({ user }) {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatDetails, setChatDetails] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (chatId) {
      const fetchAndSetMessages = async () => {
        try {
          const fetchedChatDetails = await fetchMessagesByChatId(chatId);
          const fetchedMessages = fetchedChatDetails.messages;
          setChatDetails(fetchedChatDetails);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      const socket = new WebSocket(
        `ws://localhost:8081/chats/ws?chatID=${chatId}`
      );

      socket.onopen = async () => {
        console.log("WebSocket connection opened");
        await fetchAndSetMessages(); // Fetch and set messages only once on connection open
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [chatId]);

  const sendMessage = () => {
    if (ws && newMessage) {
      const message = {
        text: newMessage,
        timestamp: new Date().toISOString(),
        userId: user.id,
      };
      ws.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

  return (
    <>
      <SidePanel currentUser={user} />
      {chatId ? (
        <ChatData messages={messages} user={user} chatDetails={chatDetails} />
      ) : (
        <p>Loading...</p>
      )}
      <div className="fixed md:w-[70%] w-full px-4  md:left-[27.5%] bottom-1 md:top-[90%] border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default withAuth(LiveChatData);
