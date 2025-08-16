import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useChat } from "../../../Context/chatProvider";
import axios from "axios";
import UserListItem from "../../UserAvatar/UserListItem";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = useChat();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent
          bg="linear-gradient(135deg, #1E1E1E, #2C2C2C)"
          color="white"
          borderRadius="lg"
          boxShadow="0 4px 20px rgba(0,0,0,0.5)"
        >
          <ModalHeader
            fontSize="30px"
            fontWeight="bold"
            textAlign="center"
            color="#38B2AC"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl mb={3}>
              <Input
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                bg="#2C2C2C"
                border="1px solid #444"
                color="white"
                _placeholder={{ color: "#aaa" }}
                _focus={{ borderColor: "#38B2AC", boxShadow: "0 0 5px #38B2AC" }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: user1, user2,..."
                onChange={(e) => handleSearch(e.target.value)}
                bg="#2C2C2C"
                border="1px solid #444"
                color="white"
                _placeholder={{ color: "#aaa" }}
                _focus={{ borderColor: "#38B2AC", boxShadow: "0 0 5px #38B2AC" }}
              />
            </FormControl>
            <Box display="flex" flexWrap="wrap" w="100%" mt={2}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div style={{ color: "#aaa" }}>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              bg="linear-gradient(135deg, #2D9CDB, #56CCF2)"
              _hover={{
                bg: "linear-gradient(135deg, #238ACF, #4FBCE8)",
              }}
              color="white"
              onClick={handleSubmit}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
