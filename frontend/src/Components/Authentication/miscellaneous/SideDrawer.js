import {
  Box,
  Tooltip,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Flex,
  Avatar,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useChat } from '../../../Context/chatProvider';
import ProfileModal from './profileModel';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatLoading from '../../ChatLoading';
import UserListItem from '../../UserAvatar/UserListItem';
import { getSender } from '../../../config/chatLogic';

const SideDrawer = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser, chats, setChats, setSelectedChat, notifications, setNotifications } = useChat();
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const searchTimeout = useRef(null);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onDrawerClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat!",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      handleSearch(value);
    }, 400); 
  };

  return (
    <>
      <Box
        bg="#1A1A2E"
        w="100%"
        p="5px 10px"
        borderBottom="2px solid #F6E05E"
        boxShadow="0 2px 10px rgba(0,0,0,0.3)"
      >
        <Flex alignItems="center" justifyContent="space-between">
          {/* Search Button */}
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button
              variant="ghost"
              onClick={onDrawerOpen}
              color="white"
              _hover={{ bg: "rgba(246, 224, 94, 0.1)" }}
            >
              <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
              <Text display={{ base: 'none', md: 'flex' }} px="4">
                Search User
              </Text>
            </Button>
          </Tooltip>

          {/* App Title */}
          <Text
            flex="1"
            textAlign="center"
            fontSize="2xl"
            fontFamily="Work sans"
            fontWeight="bold"
            color="#F6E05E"
          >
            Start TALK.
          </Text>

          <Flex gap={4} alignItems="center">
            {/* Notifications */}
            <Menu>
              <MenuButton p={1} position="relative">
                {notifications.length > 0 && (
                  <Box
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="0.7em"
                    px="2"
                    zIndex="1"
                  >
                    {notifications.length}
                  </Box>
                )}
                <BellIcon fontSize="2xl" color="#F6E05E" />
              </MenuButton>
              <MenuList bg="#1A1A2E" color="black" border="1px solid #F6E05E">
                {!notifications.length && (
                  <Text px={3} py={2} color="gray.400">No New Messages</Text>
                )}
                {notifications.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(notifications.filter((n) => n._id !== notif._id));
                    }}
                    _hover={{ bg: "#F6E05E", color: "#1A1A2E" }}
                  >
                    {notif.chat.isGroupChat
                      ? `New message in ${notif.chat.chatName}`
                      : `New message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Profile Menu */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                color="white"
                _hover={{ bg: "rgba(246, 224, 94, 0.1)" }}
              >
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user?.name}
                  src={user?.avatar}
                />
              </MenuButton>
              <MenuList bg="#1A1A2E" color="black" border="1px solid #F6E05E">
                <MenuItem _hover={{ bg: "#F6E05E", color: "#1A1A2E" }} onClick={onProfileOpen}>
                  My Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem _hover={{ bg: "red.500", color: "white" }} onClick={logoutHandler}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <ProfileModal isOpen={isProfileOpen} onClose={onProfileClose} user={user} />
      </Box>

      {/* Drawer for Search */}
      <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#1A1A2E" color="white">
          <DrawerHeader 
            borderBottomWidth="1px" 
            borderColor="yellow.400"
            fontWeight="bold"
            fontSize="xl"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={handleInputChange}
                bg="gray.800"
                color="white"
                borderColor="yellow.400"
                _placeholder={{ color: "gray.400" }}
              />
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" color="yellow.400" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
