const asyncHandler = require("express-async-handler");
const Message = require("../models/MessegeModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

const sendMessage = asyncHandler(async(req,res)=>{
   const {content , chatId} = req.body;
   if(!content || !chatId){
        console.log("Invalied data passed into Request!");
        return res.status(400);
   }
   let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
   };
   try {
        let message = await Message.create(newMessage);
        
        message = await message.populate("sender", "name");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select : "name email",
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage : message,
        });
        res.json(message);

   } catch (error) {
    res.status(401);
    throw new Error(error.message);
   }
});

const allMessages = asyncHandler(async(req,res) =>{
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name email")
        .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
});

module.exports = {sendMessage, allMessages};