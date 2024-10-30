import Message from "../models/messageModel.js";

const addNewMessage = async (message) => {
  try {
    await Message.create(message);
  } catch (error) {
    throw error;
  }
};

const getMessagebyFlatId = async (flatId) => {
  try {
    return await Message.find({ flatId: flatId }).populate({ path: "senderId", select: "firstName lastName email" });
  } catch (error) {
    throw error;
  }
};

export default { addNewMessage, getMessagebyFlatId };
