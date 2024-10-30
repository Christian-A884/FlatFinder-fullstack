import { useContext, useEffect, useState } from "react";
import SpinnerLoader from "../components/SpinnerLoader";
import { toast } from "react-toastify";
import { UserDataContext } from "../provider/userDatacontext";
import { getUserData, removeFavouriteUserFlat } from "../api/methods/auth/users";
import { getFlatById } from "../api/methods/flats/flats";

const Favourites = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userFavFlats, setUserFavFlats] = useState<Flat[]>([]);
  const { userDetails } = useContext(UserDataContext);
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

  const getUserFavouriteFlats = async () => {
    try {
      setIsLoading(true);
      const userId = userDetails._id;
      const user = await getUserData(userId);
      const favFlatsId = user.favouriteFlatList.map((flat: { _id: string }) => flat._id);
      const favFlats = await Promise.all(
        favFlatsId.map(async (id: string) => {
          const fav = await getFlatById(id);
          return fav;
        })
      );
      const favUserFlats = favFlats.map((flat) => {
        return {
          ...flat,
          dateAvailable: flat.dateAvailable.toString().slice(0, 10),
          ownerId: flat.ownerId._id,
          ownerEmail: flat.ownerId.email,
          ownerLastName: flat.ownerId.lastName,
          ownerFirstName: flat.ownerId.firstName,
        };
      });
      setUserFavFlats(favUserFlats);
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
    getUserFavouriteFlats();
  }, []);

  const handleRemoveFavFlat = async (flatId: string) => {
    try {
      setIsLoading(true);
      await removeFavouriteUserFlat(flatId);
      getUserFavouriteFlats();
      toast.success("Favourite flats updated");
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

  return (
    <>
      {isLoading && <SpinnerLoader />}
      {userFavFlats.length ? (
        <div className="overflow-x-scroll mt-16 h-[960px]">
          <table className="mx-auto my-7 w-full h-auto border-spacing-4 table-auto shadow-lg ">
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
              {Array.isArray(userFavFlats) &&
                userFavFlats?.map((obj: Flat, index) => (
                  <tr key={index}>
                    {column.map((columnItem, colIndex) => (
                      <td key={colIndex} className="text-base font-semibold text-[#173466] text-center justify-center px-2 py-1">
                        {obj[`${columnItem.value}`] as React.ReactNode}
                      </td>
                    ))}
                    <td key={obj._id as string}>
                      <button
                        onClick={() => {
                          handleRemoveFavFlat(obj._id as string);
                        }}
                        className="text-[8px] w-16 text-center bg-[#F1654D] p-1 rounded-md text-xs text-white font-semibold ml-7"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1 className="flex justify-center text-4xl font-semibold text-[#173466] items-center my-48">No flats added to Favorites</h1>
      )}
    </>
  );
};

export default Favourites;
