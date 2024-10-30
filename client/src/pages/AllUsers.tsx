import { useContext, useEffect, useState } from "react";
import { User } from "../interface";
import { getAllUsers, deleteUserByAdmin, updateUserRole } from "../api/methods/auth/users";
import { toast } from "react-toastify";
import SpinnerLoader from "../components/SpinnerLoader";
import { NavLink } from "react-router-dom";
import UserFilter from "../components/UserFilter";
import { UserDataContext } from "../provider/userDatacontext";

const AllUsers = () => {
  const [users, setUsers] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserDataContext);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsers(data as unknown as User);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      const newUsers = await deleteUserByAdmin(id);
      setUsers(newUsers);
      toast.success("User deleted");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("loggedUser") as string)) {
    }
    if (userDetails.isAdmin) {
      if (userDetails.isAdmin !== true) {
      }
    }

    getUsers();
  }, [userDetails]);

  const handleMakeAdmin = async (id: string) => {
    try {
      await updateUserRole(id);
      getUsers();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-[960px]">
      {isLoading && <SpinnerLoader />}
      <h1 className="text-center justify-cente text-[#173466] text-4xl font-bold mt-10">Users accounts</h1>
      <UserFilter users={users} setUsers={setUsers} />
      <div className=" grid grid-cols-1 mdl:grid mdl:grid-cols-2 row-auto w-full place-content-center justify-self-center">
        {Array.isArray(users) &&
          users?.map((currentUser: User, index) => (
            <div
              key={index}
              className="flex flex-col mx-auto w-[70%] mdl:w-[90%] justify-center items-center mt-28 p-4 gap-10 border-none rounded-lg bg-[#F6F7FC]  shadow-md"
            >
              <div>
                <div className="flex text-2xl sm:text-3xl font-bold text-[#173466]">
                  <h2>
                    {currentUser.firstName} {currentUser.lastName}{" "}
                  </h2>
                </div>
                <div className="flex flex-col gap-2 text-lg sm:text-xl text-[#173466] font-semibold">
                  <p>Email address: {currentUser.email}</p>
                  <p>Birthday: {currentUser.birthdate}</p>

                  <p>is Admin: {currentUser.isAdmin ? "Yes" : "No"}</p>
                  <p>Flat posted: {currentUser.userFlatCount}</p>
                </div>
                <div className="flex w-full gap-2 p-4">
                  <NavLink
                    to={`/profile/${currentUser._id}`}
                    className="text-xs w-18 h-10 py-2.5 sm:text-sm sm:w-24 sm:h-14 text-center  bg-[#F1654D] px-2 sm:py-4 rounded-md text-white font-semibold"
                  >
                    View profile
                  </NavLink>
                  {currentUser.isAdmin == false ? (
                    <button
                      onClick={() => handleMakeAdmin(currentUser._id)}
                      className="text-xs w-18 h-10 p-1 sm:text-sm sm:w-28 sm:h-14 text-center bg-[#F1654D] sm:p-2 rounded-md text-white font-semibold"
                    >
                      Make admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(currentUser._id)}
                      className="text-xs w-18 h-10 p-1 xs:text-sm sm:w-28 sm:h-14 text-center bg-[#F1654D] sm:p-2 rounded-md text-white font-semibold"
                    >
                      Remove admin
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(currentUser._id as string)}
                    className="text-xs w-18 h-10 p-1 sm:text-sm sm:w-28 sm:h-14 text-center bg-[#F1654D] sm:p-2 rounded-md text-white font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllUsers;
