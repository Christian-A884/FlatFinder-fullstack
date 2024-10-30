import { useContext, useEffect, useState } from "react";
import { getAllFlats } from "../api/methods/flats/flats";
import { FlatContext } from "../provider/flatcontext";
import { NavLink } from "react-router-dom";
import { FavFlat, Flat } from "../interface";
import FlatFilter from "../components/FlatFilter";
import SpinnerLoader from "../components/SpinnerLoader";
import { toast } from "react-toastify";
import { UserDataContext } from "../provider/userDatacontext";
import { addFavouriteUserFlat, getUserData, removeFavouriteUserFlat } from "../api/methods/auth/users";

const Homepage = () => {
  const { flat, setFlat } = useContext(FlatContext);
  const [favFlat, setFavFlat] = useState<FavFlat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserDataContext);
  const { isSessionChecked } = useContext(UserDataContext);

  const column = [
    { header: "Owner Firstname", value: "ownerFirstName" },
    { header: "Owner Lastname", value: "ownerLastName" },
    { header: "Owner email", value: "ownerEmail" },
    { header: "City", value: "city" },
    { header: "Street", value: "streetName" },
    { header: "Street number", value: "streetNumber" },
    { header: "Area size (sqm)", value: "areaSize" },
    { header: "Has AC", value: "hasAC" },
    { header: "Built Year", value: "yearBuilt" },
    { header: "Rent price (euro)", value: "rentPrice" },
    { header: "Available from", value: "dateAvailable" },
  ];

  const getFlats = async () => {
    try {
      setIsLoading(true);
      const showAllFlats = await getAllFlats();
      const allFlats = showAllFlats.map((flat: any) => {
        return {
          ...flat,
          hasAC: flat.hasAC ? "✅" : "❌",
          dateAvailable: flat.dateAvailable.toString().slice(0, 10),
          ownerId: flat.ownerId._id,
          ownerEmail: flat.ownerId.email,
          ownerLastName: flat.ownerId.lastName,
          ownerFirstName: flat.ownerId.firstName,
        };
      });
      setFlat(allFlats as Flat[]);
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    } finally {
      setIsLoading(false);
    }
  };
  const userData = async () => {
    if (userDetails) {
      const id = userDetails._id;
      const user = await getUserData(id);
      const favourite = user.favouriteFlatList;
      setFavFlat(favourite);
    }
  };

  const handleClick = async (flatId: string) => {
    try {
      setIsLoading(true);
      const result = await addFavouriteUserFlat(flatId);
      toast.success("Flat has been added favourites");
      userData();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavFlat = async (flatId: string) => {
    try {
      setIsLoading(true);
      await removeFavouriteUserFlat(flatId);
      toast.success("Flat has been removed from favourites");
      userData();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userData();
    getFlats();
  }, [isSessionChecked]);

  return (
    <>
      {isLoading && <SpinnerLoader />}
      <div className="overflow-x-scroll mt-16 h-[960px]">
        <FlatFilter />
        <table className="mx-auto my-7 w-full border-spacing-4 table-auto shadow-lg ">
          <thead>
            <tr>
              {column.map((item, index) => (
                <th className="border border-solid border-l-0 border-r-0 text-[#F1654D] text-lg items-center justify-center p-1" key={index}>
                  {item.header}
                </th>
              ))}
              <th className="border border-solid border-l-0 border-r-0 text-[#F1654D] text-lg items-center justify-center p-1">Action buttons</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(flat) &&
              flat?.map((obj: Flat, index) => (
                <tr key={index}>
                  {column.map((columnItem, colIndex) => (
                    <td key={colIndex} className="text-base font-semibold text-[#173466] text-center justify-center px-2 py-1">
                      {obj[`${columnItem.value}`] as React.ReactNode}
                    </td>
                  ))}
                  <td key={obj.id}>
                    <div className="flex w-full gap-3 items-center justify-center p-2 ">
                      <NavLink
                        to={`/profile/${obj.ownerId}`}
                        className="text-[8px] w-24 text-center bg-[#F1654D] p-1 rounded-md text-xs text-white font-semibold"
                      >
                        Owner profile
                      </NavLink>
                      <NavLink
                        to={`/flat-view/${obj._id}`}
                        className="text-[8px] w-16 text-center bg-[#F1654D] p-1 rounded-md text-xs text-white font-semibold"
                      >
                        View flat
                      </NavLink>
                      {userDetails?._id ? (
                        <button
                          onClick={() => {
                            if (favFlat.some((item) => item._id === obj._id)) {
                              handleRemoveFavFlat(obj._id as string);
                            } else {
                              handleClick(obj._id as string);
                            }
                          }}
                          className={`text-xs  ${
                            favFlat.some((item) => item._id === obj._id) ? "bg-blue-600" : "bg-[#F1654D]"
                          }  p-1 rounded-md text-white font-semibold`}
                        >
                          Favorite
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Homepage;
