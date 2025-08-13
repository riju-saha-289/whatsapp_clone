import React from 'react';
import { FiMenu, FiArrowLeft } from 'react-icons/fi';

const Header = ({ toggleSidebar, isDesktop, selectedWaId, messages, showSidebar, onBack }) => {
  const contactName = messages.find(m => m.wa_id === selectedWaId)?.contactName || 'Select a chat';

  if (isDesktop) return null; // No header on desktop

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-300 shadow-md md:hidden">
      {showSidebar ? (
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="text-3xl text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          <FiMenu />
        </button>
      ) : (
        <button
          onClick={onBack}
          aria-label="Back to chats"
          className="text-3xl text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          <FiArrowLeft />
        </button>
      )}
      <h1 className="text-lg font-semibold truncate max-w-xs">{contactName}</h1>
      <div className="w-8" />
    </header>
  );
};

export default Header;
