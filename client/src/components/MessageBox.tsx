import { useRef } from "react";
import { addNewMessage } from "../api/methods/messages/message";
import { useParams } from "react-router";
import { toast } from "react-toastify";

const MessageBox = () => {
  const messageContent = useRef<HTMLInputElement>(null);
  const flatId = useParams();

  const sendMessage = async () => {
    try {
      if (flatId && messageContent.current) {
        await addNewMessage(flatId.id as string, messageContent.current.value);
        messageContent.current.value = " ";
        toast.success("Message sent");
      }
    } catch (error) {
      toast.error("Message couldn't be send");
    }
  };

  return (
    <div className="flex flex-col h-[50%] w-[90%] justify-center items-center mt-16 mr-40 gap-6 border-none rounded-lg bg-[#F6F7FC]  shadow-md">
      <div className="flex flex-col gap-5 w-full h-[50%] items-center text-[#173466] font-semibold">
        <label className="text-lg" htmlFor="message">
          You can leave a message here:
        </label>
        <textarea ref={messageContent} id="message" cols={40} rows={4} className="text-xs "></textarea>
      </div>
      <button onClick={sendMessage} type="button" className="text-sm w-20 text-center bg-[#F1654D] p-1 rounded-md text-white font-semibold">
        Send
      </button>
    </div>
  );
};

export default MessageBox;
