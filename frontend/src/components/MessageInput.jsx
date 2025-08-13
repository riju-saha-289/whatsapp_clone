import React, { useState, useContext } from "react";
import { MessageContext } from "../context/MessageContext.jsx";

const MessageInput = ({ wa_id, from, to, contactName }) => {
  const [text, setText] = useState("");
  const { sendMessage } = useContext(MessageContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const msgData = {
      wa_id,
      from,
      to,
      type: "text",
      content: { body: text.trim() },
      contactName,
      timestamp: new Date().toISOString(),
      status: "pending",
      isFromUser: true,
      msg_id: "msg-" + Date.now(),
    };

    sendMessage(msgData);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="message-input-form p-3 border-t bg-white flex items-center space-x-2"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-grow min-w-0 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
