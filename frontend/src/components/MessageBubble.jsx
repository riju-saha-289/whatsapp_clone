import React from 'react';

const statusIcons = {
  sent: '✓',
  delivered: '✓✓',
  read: '✓✓',
  pending: '⏳',
};

const MessageBubble = ({ message }) => {
  const isFromUser = message.isFromUser;

  return (
    <div
      className={`max-w-xs px-4 py-2 rounded-lg break-words
        ${
          isFromUser
            ? 'bg-blue-600 text-white self-end rounded-br-none shadow'
            : 'bg-gray-200 text-gray-900 self-start rounded-bl-none shadow-sm'
        }
      `}
    >
      <p>{message.content?.body || '[Non-text message]'}</p>
      <div className="text-xs text-gray-200 mt-1 flex justify-end items-center space-x-2 select-none">
        <span>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <span>{statusIcons[message.status]}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
