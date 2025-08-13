import React from 'react';

const ChatList = ({ conversations, selectedWaId, onSelect, className }) => {
  const convList = Object.entries(conversations)
    .map(([wa_id, msgs]) => {
      if (!msgs || msgs.length === 0) return null; // skip empty conversations

      // Find the last message by timestamp
      const lastMsg = msgs.reduce((a, b) => {
        const aTime = new Date(a.timestamp).getTime() || 0;
        const bTime = new Date(b.timestamp).getTime() || 0;
        return aTime > bTime ? a : b;
      }, msgs[0]);

      return { wa_id, lastMsg };
    })
    .filter(Boolean) // remove nulls from empty conversations
    .sort((a, b) => {
      const timeA = new Date(a.lastMsg?.timestamp).getTime() || 0;
      const timeB = new Date(b.lastMsg?.timestamp).getTime() || 0;
      return timeB - timeA;
    });

  return (
    <div className={className}>
      <h2 className="text-xl font-bold p-4 border-b sticky top-0 bg-white z-10 select-none">
        Chats
      </h2>
      <ul>
        {convList.map(({ wa_id, lastMsg }) => (
          <li
            key={wa_id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(wa_id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(wa_id);
            }}
            className={`flex items-center cursor-pointer p-4 border-b hover:bg-gray-100 focus:outline-none focus:bg-blue-200 ${
              wa_id === selectedWaId ? 'bg-blue-100' : ''
            }`}
            aria-selected={wa_id === selectedWaId}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 select-none">
              {(lastMsg?.contactName?.[0]?.toUpperCase()) || wa_id[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex flex-col flex-grow min-w-0">
              <div className="font-semibold truncate">
                {lastMsg?.contactName || wa_id}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {lastMsg?.content?.body || '[Non-text message]'}
              </div>
            </div>
            <div className="text-xs text-gray-400 ml-2 whitespace-nowrap select-none">
              {lastMsg?.timestamp
                ? new Date(lastMsg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
