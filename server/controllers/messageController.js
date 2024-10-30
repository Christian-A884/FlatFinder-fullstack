import flatService from "../services/flatService.js";
import messageService from "../services/messageService.js";

const sendMessage = async (req, res) => {
  const { content } = req.body;
  const { flatId } = req.params;
  const { _id } = req.user;

  try {
    const message = await messageService.addNewMessage({ content, senderId: _id, flatId });
    res.status(200).send({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(500).send({ message: "An error has occured while registering", error: error.message });
  }
};

const getMessagebyFlatId = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user._id;

  try {
    const flat = await flatService.getFlatById(id);
    if (ownerId !== flat.ownerId._id.toString()) {
      return res.status(403).send({ message: "You don't have access to owner messages" });
    }
    const messages = await messageService.getMessagebyFlatId(id);
    res.status(200).send({ message: "All messages received", data: messages });
  } catch (error) {
    res.status(500).send({ message: "An error has occured while registering", error: error.message });
  }
};

export default { sendMessage, getMessagebyFlatId };
