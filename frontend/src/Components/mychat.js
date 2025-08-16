import React, { useEffect, useState } from "react";
import { useChat } from "../Context/chatProvider";
import { Box, useToast, Text, Button, Stack } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/chatLogic";
import GroupChatModel from "./Authentication/miscellaneous/GroupChatModel";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = useChat();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessAIChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat/ai", {}, config); // API جديد بيرجع شات خاص بالـ AI
      setSelectedChat(data);
    } catch (error) {
      toast({
        title: "AI Chat Error",
        description: "Failed to access AI chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg="#0F0F1C"
      color="white"
      w={{ base: "100%", md: "30%" }}
      borderRadius="xl"
      boxShadow="dark-lg"
      transition="0.3s"
    >
      {/* Header */}
      <Box
        pb={3}
        px={3}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid rgba(255,255,255,0.1)"
      >
        <Text
          fontSize={{ base: "18px", md: "20px" }}
          fontWeight="bold"
          color="yellow.400"
        >
          My Chats
        </Text>

        <Box display="flex" gap={2}>
          <GroupChatModel>
            <Button
              fontSize="sm"
              bg="yellow.400"
              color="black"
              _hover={{ bg: "yellow.300", transform: "scale(1.05)" }}
              transition="0.3s"
            >
              add Group
            </Button>
          </GroupChatModel>

          {/* ✅ زرار Talk to AI */}
          <Button
            fontSize="sm"
            bg="blue.400"
            color="white"
            _hover={{ bg: "blue.300", transform: "scale(1.05)" }}
            transition="0.3s"
            onClick={accessAIChat}
          >
            Talk to AI
          </Button>
        </Box>
      </Box>

      {/* Chats List */}
      <Box
        flex="1"
        mt={3}
        p={3}
        w="100%"
        borderRadius="lg"
        overflowY="auto"
        bg="rgba(255,255,255,0.04)"
        css={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "3px",
          },
        }}
      >
        {chats ? (
          <Stack spacing={2}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={
                  selectedChat === chat
                    ? "yellow.400"
                    : "rgba(255,255,255,0.06)"
                }
                color={selectedChat === chat ? "black" : "white"}
                px={3}
                py={2}
                borderRadius="md"
                transition="0.3s"
                _hover={{
                  bg:
                    selectedChat === chat
                      ? "yellow.300"
                      : "rgba(255,255,255,0.12)",
                  transform: "scale(1.02)",
                }}
              >
                <Text fontWeight="medium">
                  {!chat.isGroupChat
                    ? chat.isAIChat
                      ? "🤖 AI Bot"
                      : getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
