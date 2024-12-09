import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const loggedInUser = req.user._id;

  const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
    "-password"
  );

  res
    .status(200)
    .json(new apiResponse(200, filteredUsers, "all users fetched"));
});

const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  if (!userToChatId) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "ReceiverId id required"));
  }

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  res
    .status(200)
    .json(new apiResponse(400, messages, "all messages fetch successfully"));
});

const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const imagePath = req.file?.path;
  const senderId = req.user._id;
  const { id: receiverId } = req.params;

  let imageUrl;
  if (imagePath) {
    const uploadResponse = await uploadOnCloudinary(imagePath);

    imageUrl = uploadResponse.secure_url;
  }

  const message = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  res
    .status(201)
    .json(new apiResponse(400, message, "Message send successfully"));
});

export { getAllUsers, getMessages, sendMessage };
