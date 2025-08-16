const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoute");
const colors = require("colors");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/error");
const cors = require("cors");

const { AzureKeyCredential } = require("@azure/core-auth");
const createClient = require("@azure-rest/ai-inference").default;

const fs = require("fs");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.MONGO_URL,
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.blue.bold);
});

const endpoint = "https://models.github.ai/inference";
const token = process.env.AI_TOKEN;
const client = createClient(endpoint, new AzureKeyCredential(token));

const historyFile = path.resolve("chat_history.json");

let messages = [];
if (fs.existsSync(historyFile)) {
  const data = fs.readFileSync(historyFile, "utf-8");
  messages = JSON.parse(data);
} else {
  messages = [{ role: "system", content: "You are a helpful assistant." }];
}

function saveHistory() {
  fs.writeFileSync(historyFile, JSON.stringify(messages, null, 2));
}

async function getAIResponse(userMessage) {
  try {
    messages.push({ role: "user", content: userMessage });

    let aiReply = "";
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes("time")) {
      const now = new Date().toLocaleTimeString();
      aiReply = `The current time is ${now}`;
    } else if (lowerMsg.includes("date")) {
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      aiReply = `Today's date is ${today}`;
    } else {
      const result = await client.path("/chat/completions").post({
        body: {
          model: "gpt-4o-mini",
          messages: messages,
        },
      });

      if (result.status !== "200") {
        console.error("Error from AI API:", result);
        aiReply = "Error: AI service failed.";
      } else {
        aiReply = result.body.choices[0].message.content;
      }
    }

    messages.push({ role: "assistant", content: aiReply });
    saveHistory();

    return aiReply;
  } catch (error) {
    console.error("AI Request Error:", error);
    return "Error: Unable to connect to AI service.";
  }
}

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡️ New socket.io connection");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", async (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });

    if (chat.isAIChat) {
      const aiReply = await getAIResponse(newMessageReceived.content);

      socket.emit("message received", {
        _id: Date.now(),
        sender: { _id: "AI_BOT", name: "AI Bot" },
        content: aiReply,
        chat: newMessageReceived.chat,
      });
    }
  });

  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(socket.id);
  });
});
