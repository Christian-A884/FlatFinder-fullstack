import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/flatFinder.png";
import { useContext, useState } from "react";
import { UserDataContext } from "../provider/userDatacontext";
import { logoutUser, deleteUser } from "../api/methods/auth/users";

import SpinnerLoader from "./SpinnerLoader";
import { toast } from "react-toastify";

const Navbar = () => {
  const { userDetails, setUserDetails } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(false);

  const pageName = [
    { page: "Home", path: "/" },
    { page: "My Profile", path: `/profile/${userDetails?._id}` },
    { page: "My Flats", path: "/my-flats" },
    { page: "Favorites", path: "/favourites" },
    { page: "All Users", path: "/allusers" },
  ];

  const [render] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isMyFlatsPage = location.pathname === "/my-flats";

  const handleLogout = async () => {
    await logoutUser();
    setUserDetails(null);
    navigate("/login");
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await deleteUser();
      await handleLogout();

      toast.success("User deleted");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
    setIsLoading(false);
  };

  if (!render) {
    return null;
  }

  return (
    <nav className="hidden mdl:flex justify-between p-4 items-center">
      {isLoading && <SpinnerLoader />}
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={logo} className="h-[60px]" alt="logo" />
        </Link>
        {userDetails?.email ? (
          <h2 className="text-lg text-[#F1654D] font-semibold">
            Hello, {userDetails.firstName} {userDetails.lastName}
          </h2>
        ) : (
          <h2></h2>
        )}
      </div>

      <div>
        <ul className="flex gap-4">
          {userDetails?.isAdmin == true
            ? pageName.map((page, index) => (
                <li key={index} className="flex text-lg text-[#a2aaad] font-semibold hover:opacity-60">
                  <NavLink to={page.path}>{page.page}</NavLink>
                </li>
              ))
            : pageName.slice(0, 4).map((page, index) => (
                <li key={index} className="flex text-lg text-[#a2aaad] font-semibold">
                  <NavLink to={page.path}>{page.page}</NavLink>
                </li>
              ))}
        </ul>
      </div>
      <div>
        {!userDetails?.email ? (
          <Link className="text-[14px] font-semibold border p-1 bg-[#F1654D] border-none rounded-md text-[#F6F7FC]" to={"/Login"}>
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            {isMyFlatsPage && (
              <Link
                to={"/new-flat"}
                className="text-xs border p-1 bg-[#F1654D] border-none rounded-md text-[#F6F7FC] font-semibold hover:text-gray-200"
              >
                + New Flat
              </Link>
            )}
            <button
              onClick={handleDeleteUser}
              className="text-xs border p-1 bg-[#F1654D] border-none rounded-md text-[#F6F7FC] font-semibold hover:text-gray-200"
            >
              Delete Account
            </button>
            <button
              className="text-xs border p-1 bg-[#F1654D] border-none rounded-md text-[#F6F7FC] font-semibold hover:text-gray-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
