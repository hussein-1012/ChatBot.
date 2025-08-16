import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { useChat } from "../Context/chatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChat();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={4}
      bg="linear-gradient(135deg, #1E1E1E, #2C2C2C)"
      color="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="xl"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.4)"
      overflow="hidden"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
