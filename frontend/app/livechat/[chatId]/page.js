"use client";
import SidePanel from "@/app/components/sidepanel";
import ChatData from "@/app/components/chatdata";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import { fetchMessagesByChatId } from "@/app/helper/apiHelpers"; // Import the fetch function

const LiveChatData = () => {
  const { loading, user } = useAuth();
  const router = useRouter();
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/users/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (chatId) {
      const fetchAndSetMessages = async () => {
        try {
          const fetchedChatDetails = await fetchMessagesByChatId(chatId);
          const fetchedMessages = fetchedChatDetails.messages;
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SidePanel />
      {chatId ? (
        <ChatData messages={messages} user={user} chatId={chatId} />
      ) : (
        <p>Loading...</p>
      )}
      <div className="fixed w-[70%] left-[27.5%] top-[90%] border-t border-gray-200">
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
};

export default LiveChatData;
