const express = require("express");
const { protect } = require("../middleware/authMiddle_ware");
const {
  accessChat,
  accessAIChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  RemoveFromGroup,
  AddToGroup,
} = require("../Controllers/ChatContoller");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/removeFromGroup").put(protect, RemoveFromGroup);
router.route("/GroupAdd").put(protect, AddToGroup);

// ✅ Route جديد لإنشاء شات AI
router.route("/ai").post(protect, accessAIChat);

module.exports = router;
