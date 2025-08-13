import React, { useState, useContext, useEffect } from "react";
import ChatList from "./components/ChatList.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import Header from "./components/Header.jsx";
import { MessageContext } from "./context/MessageContext.jsx";

const App = () => {
  const {
    messages,
    chatList,
    loadingMessages,
    loadingChatList,
    errorMessages,
    errorChatList,
    fetchMessages,
  } = useContext(MessageContext);


  const [selectedWaId, setSelectedWaId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Set selectedWaId on chatList load
  useEffect(() => {
    if (!selectedWaId && chatList.length > 0) {
      setSelectedWaId(chatList[0].wa_id);
    }
  }, [chatList, selectedWaId]);

  // Fetch messages on selectedWaId change
  useEffect(() => {
    if (selectedWaId) {
      fetchMessages({ wa_id: selectedWaId });
    }
  }, [selectedWaId]);

  // Update isDesktop on resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (wa_id) => {
    setSelectedWaId(wa_id);
    if (!isDesktop) setShowSidebar(false);
  };

  const handleBack = () => {
    if (!isDesktop) setShowSidebar(true);
  };

  // Find contactName from messages
  const contactName =
    messages.find((m) => m.wa_id === selectedWaId)?.contactName || "";

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      {(isDesktop || !showSidebar) && (
        <Header
          toggleSidebar={() => setShowSidebar((v) => !v)}
          showSidebar={showSidebar}
          isDesktop={isDesktop}
          selectedWaId={selectedWaId}
          messages={messages}
          onBack={handleBack}
        />
      )}

      <div className="flex flex-grow overflow-hidden h-full min-h-0 min-w-0">
        {(isDesktop || showSidebar) && (
          <aside
            className={`border-r border-gray-300 bg-white flex flex-col ${
              isDesktop ? "max-w-xs w-full md:w-72" : "w-full"
            }`}
          >
            {loadingChatList ? (
              <div className="p-4 text-center text-gray-500">
                Loading chats...
              </div>
            ) : errorChatList ? (
              <div className="p-4 text-center text-red-600">
                Error loading chats: {errorChatList}
              </div>
            ) : (
              <ChatList
                conversations={chatList.reduce((acc, c) => {
                  if (c.lastMsgContent) {
                    acc[c._id] = [
                      {
                        content: c.lastMsgContent, // wrap lastMsgContent inside 'content'
                        contactName: c.contactName,
                        timestamp: c.lastMsgTimestamp,
                      },
                    ];
                  } else {
                    acc[c._id] = [];
                  }
                  return acc;
                }, {})}
                selectedWaId={selectedWaId}
                onSelect={handleSelect}
                className="flex-grow overflow-auto hide-scrollbar"
              />
            )}
          </aside>
        )}

        {(isDesktop || !showSidebar) && (
          <main
            className={`flex-grow min-w-0 flex flex-col bg-white ${
              !isDesktop ? "w-full" : ""
            }`}
          >
            {loadingMessages ? (
              <div className="p-4 text-center text-gray-500 flex-grow flex items-center justify-center">
                Loading messages...
              </div>
            ) : errorMessages ? (
              <div className="p-4 text-center text-red-600 flex-grow flex items-center justify-center">
                Error loading messages: {errorMessages}
              </div>
            ) : (
              <ChatWindow
                messages={messages}
                contactName={contactName}
                wa_id={selectedWaId}
                className="flex-grow flex flex-col"
              />
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default App;
