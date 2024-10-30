import { useContext, useEffect, useState } from "react";
import SpinnerLoader from "../components/SpinnerLoader";
import EditProfileModal from "../components/EditProfileModal";
import { toast } from "react-toastify";
import { UserDataContext } from "../provider/userDatacontext";
import { getUserData, getSpecificUserData, deleteUser, logoutUser } from "../api/methods/auth/users";
import { useNavigate, useParams } from "react-router";
import { User } from "../interface";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { _id } = useParams();

  const [editUser, setEditUser] = useState(false);
  const [userData, setUserData] = useState({} as User);
  const { userDetails, setUserDetails } = useContext(UserDataContext);
  const navigate = useNavigate();

  const toggleEditUserProfileModal = () => {
    setEditUser(!editUser);
  };
  const selectedUser = async (_id: string) => {
    if (userDetails?._id === _id) {
      const user = await getUserData(_id);
      setUserData(user);
    } else {
      const user = await getSpecificUserData(_id);
      setUserData(user);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await deleteUser();
      toast.success("User deleted");
      await logoutUser();
      setUserDetails(null);
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      selectedUser(_id as string);
    } catch (error) {
      toast.error("Receiving data error");
    } finally {
      setIsLoading(false);
    }
  }, []);
  return (
    <>
      {isLoading && <SpinnerLoader />}
      <div className=" flex flex-col w-full h-[960px] justify-center ">
        <div className="flex justify-center items-center">
          {userData?.email ? (
            <div className="flex flex-col w-[80%] sm:w-[70%] md:w-[65%] mdl:max-w-[50%] justify-center items-center mx-auto p-4 gap-10 border-none rounded-lg bg-[#F6F7FC]  shadow-md">
              <div className="flex text-3xl font-bold text-[#173466]">
                <h2>
                  {userData?.firstName} {userData?.lastName}{" "}
                </h2>
              </div>
              <div className="flex flex-col gap-2 text-xl text-[#173466] font-semibold">
                <p>Email address: {userData?.email} </p>
                <p>Birthday: {userData?.birthdate} </p>

                <p>is Admin: {userData?.isAdmin ? "Yes" : "No"}</p>
              </div>
              {(userDetails?.email === userData?.email || userDetails?.isAdmin) && (
                <div className="flex gap-7">
                  <button
                    onClick={toggleEditUserProfileModal}
                    className="text-sm w-24 text-center bg-[#F1654D] p-2 rounded-md text-white font-semibold"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteUser(_id as string);
                    }}
                    className="text-sm w-24 text-center bg-[#F1654D] p-2 rounded-md text-white font-semibold"
                  >
                    Delete profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-colw-[80%] sm:w-[70%] md:w-[65%] mdl:max-w-[50%] justify-center items-center mx-auto p-4 gap-10 border-none rounded-lg bg-[#F6F7FC]  shadow-md text-3xl font-bold text-[#173466]">
              No user is logged in
            </div>
          )}
        </div>
        {editUser && (
          <EditProfileModal closeModal={toggleEditUserProfileModal} userData={userData} setUserData={setUserData} setUserDetails={setUserDetails} />
        )}
      </div>
    </>
  );
};

export default Profile;
