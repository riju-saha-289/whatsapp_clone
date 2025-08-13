import React, { useEffect, useRef } from 'react';
import MessageInput from './MessageInput.jsx';
import MessageBubble from './MessageBubble.jsx';

const ChatWindow = ({ messages, contactName, wa_id, className }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className={`${className} flex flex-col h-full`}>
      <div className="p-4 border-b font-bold sticky top-0 bg-white z-10 flex items-center space-x-3 select-none">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {contactName ? contactName[0].toUpperCase() : wa_id ? wa_id[0].toUpperCase() : '?'}
        </div>
        <div className="truncate">{contactName || wa_id || 'Select a chat'}</div>
      </div>

      <div className="flex-grow overflow-auto hide-scrollbar p-4 space-y-3 flex flex-col bg-gray-50">
        {sortedMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 select-none">No messages</div>
        ) : (
          sortedMessages.map(msg => <MessageBubble key={msg.msg_id} message={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        wa_id={wa_id}
        from={wa_id}
        to={sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1].to : ''}
        contactName={contactName}
      />
    </div>
  );
};

export default ChatWindow;
