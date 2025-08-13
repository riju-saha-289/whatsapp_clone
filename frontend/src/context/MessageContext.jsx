import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);

  // Separate loading states
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChatList, setLoadingChatList] = useState(false);

  // Separate error states
  const [errorMessages, setErrorMessages] = useState(null);
  const [errorChatList, setErrorChatList] = useState(null);

  // Base URL for your backend API
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // Fetch chat list summaries
  const fetchChatList = async () => {
    setLoadingChatList(true);
    setErrorChatList(null);
    try {
      const response = await axios.get(`${API_BASE}/chatlist`);
      setChatList(response.data);
    } catch (err) {
      setErrorChatList(err.message || "Failed to fetch chat list");
    } finally {
      setLoadingChatList(false);
    }
  };

  // Fetch full messages for selected chat
  const fetchMessages = async (filters = {}) => {
    setLoadingMessages(true);
    setErrorMessages(null);
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE}/messages`, { params });
      setMessages(response.data);
    } catch (err) {
      setErrorMessages(err.message || "Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Update message status in backend and local state
  const updateMessageStatus = async (msg_id, status) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/messages/${msg_id}/status`,
        { status }
      );
      setMessages((prev) =>
        prev.map((m) => (m.msg_id === msg_id ? response.data : m))
      );
      return response.data;
    } catch (err) {
      setErrorMessages(err.message || "Failed to update message status");
      throw err;
    }
  };

  // Delete a message
  const deleteMessage = async (msg_id) => {
    try {
      await axios.delete(`${API_BASE}/messages/${msg_id}`);
      setMessages((prev) => prev.filter((m) => m.msg_id !== msg_id));
    } catch (err) {
      setErrorMessages(err.message || "Failed to delete message");
      throw err;
    }
  };

  // Send a new message (demo)
  const sendMessage = async (msgData) => {
    try {
      const generatedMsgId = `temp-${Date.now()}`;
      const tempMsg = {
        ...msgData,
        msg_id: generatedMsgId,
        timestamp: new Date().toISOString(),
        status: "pending",
      };
      setMessages((prev) => [...prev, tempMsg]);

      // Send to backend
      const res = await axios.post(`${API_BASE}/messages`, {
        ...msgData,
        msg_id: generatedMsgId,
      });

      // Replace temp message with response data
      setMessages((prev) =>
        prev.map((m) => (m.msg_id === generatedMsgId ? res.data : m))
      );

      // Update chatList to reflect new last message
      setChatList((prev) => {
        const index = prev.findIndex((c) => c.wa_id === res.data.wa_id);
        if (index !== -1) {
          // Update existing chat
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMsg: res.data,
          };
          return updated;
        } else {
          // Add new chat
          return [...prev, { wa_id: res.data.wa_id, lastMsg: res.data }];
        }
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // On mount, fetch chat list summaries
  useEffect(() => {
    fetchChatList();
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        chatList,
        loadingMessages,
        loadingChatList,
        errorMessages,
        errorChatList,
        fetchMessages,
        fetchChatList,
        updateMessageStatus,
        deleteMessage,
        sendMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
