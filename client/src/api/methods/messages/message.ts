import axios from "axios";

export const addNewMessage = async (flatId: string, message: string) => {
  try {
    await axios.post(
      `http://localhost:4000/api/message/newMessage/${flatId}`,
      {
        content: message,
      },
      { withCredentials: true }
    );
  } catch (error: any) {
    throw error.data.message;
  }
};

export const showMessages = async (flatId: string) => {
  try {
    const result = await axios(`http://localhost:4000/api/flats/messages/${flatId}`, { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.data.message;
  }
};
