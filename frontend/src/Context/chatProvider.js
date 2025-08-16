import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <ChatContext.Provider
     value={{ user, setUser, selectedChat,
      setSelectedChat, chats, setChats, notifications, setNotifications }}>
      {children}
    </ChatContext.Provider>
  );
};
export const useChat = () => useContext(ChatContext);

export default ChatProvider;
