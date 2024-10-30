import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import FlatModal from "../components/FlatModal";
import { Flat, Message } from "../interface";
import MessageBox from "../components/MessageBox";
import { getFlatById } from "../api/methods/flats/flats";
import SpinnerLoader from "../components/SpinnerLoader";
import { toast } from "react-toastify";
import { UserDataContext } from "../provider/userDatacontext";
import { deleteFlat } from "../api/methods/flats/flats";
import { showMessages } from "../api/methods/messages/message";

const FlatView = () => {
  const [flatModal, setFlatModal] = useState(false);
  const [currentFlat, setCurrentFlat] = useState<Flat | null>(null);

  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserDataContext);
  const navigate = useNavigate();

  const toggleFlatModal = () => {
    setFlatModal(!flatModal);
  };
  const handleDeleteFlat = async (id: string) => {
    try {
      await deleteFlat(id);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function getData() {
      if (id) {
        try {
          setIsLoading(true);

          const data = await getFlatById(id);
          const flatbyId = {
            ...data,
            ownerId: data.ownerId._id,
            ownerLastName: data.ownerId.lastName,
            ownerFirstName: data.ownerId.firstName,
            ownerEmail: data.ownerId.email,
            dateAvailable: data.dateAvailable.toString().slice(0, 10),
          };
          setCurrentFlat(flatbyId);
          if (userDetails._id === flatbyId.ownerId) {
            const messages = await showMessages(id);
            const myMessages = messages.map((message: any) => {
              return {
                ...message,
                senderId: message.senderId._id,
                senderEmail: message.senderId.email,
                senderLastname: message.senderId.lastName,
                senderFirstname: message.senderId.firstName,
              };
            });
            setAllMessages(myMessages);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
    getData();
  }, []);

  return (
    <>
      {isLoading && <SpinnerLoader />}
      <div className=" flex flex-col w-full h-[960px] justify-center ">
        <div className="flex justify-items-center justify-self-center">
          {currentFlat ? (
            <div className="flex w-[50%] justify-center items-center mx-auto p-4 gap-10 mb-10 border-none rounded-lg bg-[#F6F7FC]  shadow-md">
              <div className="w-[40%]">
                <img src={currentFlat.photoURL} alt="image" />
              </div>
              <div>
                <div className="flex text-3xl font-bold text-[#173466]">
                  <h2>{`Mr ${currentFlat.ownerLastName} flat`}</h2>
                </div>
                <div className="flex flex-col gap-2 text-xl text-[#173466] font-semibold">
                  <p>City: {currentFlat.city}</p>
                  <p>
                    Adress: {currentFlat.streetName} street, no. {currentFlat.streetNumber}{" "}
                  </p>
                  <p>Has AC: {(currentFlat.hasAC = true ? "Yes" : "No")}</p>
                  <p>Built year: {currentFlat.yearBuilt}</p>
                  <p>Description: {currentFlat.description}</p>
                  <p>Rent price: {currentFlat.rentPrice} euro</p>
                  <p>Available date: {currentFlat.dateAvailable}</p>
                  <p></p>
                </div>
                {currentFlat.ownerId === userDetails._id || userDetails.isAdmin === true ? (
                  <div className="flex gap-4">
                    <button onClick={toggleFlatModal} className="text-sm w-20 text-center bg-[#F1654D] p-2 rounded-md text-white font-semibold">
                      Edit Flat
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteFlat(id as string);
                      }}
                      className="text-sm w-20 text-center bg-[#F1654D] p-2 rounded-md text-white font-semibold"
                    >
                      Delete flat
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full justify-center items-center  mx-auto p-4 gap-10 border-none rounded-lg bg-[#F6F7FC]  shadow-md"></div>
          )}
          <div>
            {currentFlat && currentFlat.ownerId !== userDetails._id ? (
              <MessageBox />
            ) : (
              allMessages.map((message, index) => (
                <div
                  key={index}
                  className="flex flex-col min-h-[40%] w-[100%] justify-center items-start mt-10 mx-auto gap-2 border-none rounded-lg bg-[#F6F7FC]  shadow-md"
                >
                  <p className="text-sm text-[#173466] font-semibold pl-3">Message date: {message.createdAt.toString().slice(0, 10)}</p>
                  <p className="text-sm text-[#173466] font-semibold pl-3">
                    Sender name: {message.senderFirstname} {message.senderLastname}
                  </p>
                  <p className="text-sm text-[#173466] font-semibold pl-3">Sender email: {message.senderEmail}</p>
                  <p className="text-sm text-[#173466] font-semibold pl-3">Message: "{message.content}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        {flatModal && <FlatModal currentFlat={currentFlat} setCurrentFlat={setCurrentFlat} closeModal={toggleFlatModal} />}
      </div>
    </>
  );
};

export default FlatView;
