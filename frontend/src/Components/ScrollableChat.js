import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogic";
import { useChat } from "../Context/chatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = useChat();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", alignItems: "flex-end" }} key={m._id || i}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                  border="2px solid"
                  borderColor={
                    m.sender._id === user._id ? "blue.400" : m.sender.name === "AI Bot" ? "yellow.400" : "gray.500"
                  }
                  boxShadow="md"
                />
              </Tooltip>
            )}
            <span
              style={{
                background:
                  m.sender._id === user._id
                    ? "linear-gradient(135deg, #1F3C88, #2D9CDB)"
                    : m.sender.name === "AI Bot"
                    ? "linear-gradient(135deg, #FFD700, #FFA500)"
                    : "linear-gradient(135deg, #2C2C2C, #3D3D3D)",
                color: "white",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "18px",
                padding: "10px 16px",
                maxWidth: "75%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                fontSize: "15px",
                lineHeight: "1.5",
                wordBreak: "break-word",
                transition: "0.2s ease-in-out",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
