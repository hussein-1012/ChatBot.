const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

const AI_USER_ID = "68a0cce67e969b9fa6255151"; 

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "UserId not provided" });

    let chat = await Chat.findOne({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage");

    if (chat) return res.send(chat);

    const newChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
    res.status(200).send(fullChat);
});

const accessAIChat = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let chat = await Chat.findOne({
        isGroupChat: false,
        isAIChat: true,
        users: { $all: [userId, AI_USER_ID] }
    }).populate("users", "-password").populate("latestMessage");

    if (chat) return res.send(chat);

    const newChat = await Chat.create({
        chatName: "AI Chat",
        isGroupChat: false,
        isAIChat: true,
        users: [userId, AI_USER_ID],
    });

    const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
    res.status(200).send(fullChat);
});

const fetchChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

    res.status(200).send(chats);
});

const createGroupChat = asyncHandler(async (req, res) => {
    const { users, name } = req.body;

    if (!users || !name) return res.status(400).json({ message: "Please provide all fields" });

    let groupUsers = JSON.parse(users);

    if (groupUsers.length < 2) return res.status(400).json({ message: "More than 2 users required" });

    groupUsers.push(req.user);

    const groupChat = await Chat.create({
        chatName: name,
        users: groupUsers,
        isGroupChat: true,
        groupAdmin: req.user
    });

    const fullGroupChat = await Chat.findById(groupChat._id).populate("users", "-password").populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(updatedChat);
});

const AddToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(updatedChat);
});

const RemoveFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(updatedChat);
});

module.exports = {
    accessChat,
    accessAIChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    AddToGroup,
    RemoveFromGroup,
};
