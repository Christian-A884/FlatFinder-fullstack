import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getFlatsbyOwnerId } from "../api/methods/flats/flats";
import { Flat } from "../interface";
import SpinnerLoader from "../components/SpinnerLoader";
import { UserDataContext } from "../provider/userDatacontext";
import { deleteFlat } from "../api/methods/flats/flats";

const MyFlats = () => {
  const [userFlats, setUserFlats] = useState<Flat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flatCount, setFlatCount] = useState<number>(0);
  const { userDetails } = useContext(UserDataContext);

  const getUserFlats = async () => {
    try {
      setIsLoading(true);
      const data = (await getFlatsbyOwnerId()) as Flat[];
      const myFlats = data.map((flat: any) => {
        return { ...flat, dateAvailable: flat.dateAvailable.toString().slice(0, 10) };
      });
      setUserFlats(myFlats);
      setFlatCount(data.length);
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
    getUserFlats();
  }, [flatCount]);

  const handleDeleteFlat = async (id: string) => {
    try {
      await deleteFlat(id);
      await getUserFlats();
    } catch (error) {
      throw error;
    }
  };

  const column = [
    { header: "City", value: "city" },
    { header: "Street", value: "streetName" },
    { header: "Street number", value: "streetNumber" },
    { header: "Area size (sqm)", value: "areaSize" },
    { header: "Has AC", value: "hasAC" },
    { header: "Built Year", value: "yearBuilt" },
    { header: "Rent price (euro)", value: "rentPrice" },
    { header: "Available from", value: "dateAvailable" },
  ];

  return (
    <>
      {isLoading && <SpinnerLoader />}
      {userFlats.length ? (
        <div className="overflow-x-scroll mt-16 h-[906px]">
          <table className="mx-auto my-7 w-[95%] h-auto border-spacing-4 table-auto shadow-lg ">
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
              {userFlats.map((obj: Flat, index) => (
                <tr key={index}>
                  {column.map((columnItem, colIndex) => (
                    <td key={colIndex} className="text-base font-semibold text-[#173466] text-center justify-center px-2 py-1">
                      {obj[`${columnItem.value}`] as React.ReactNode}
                    </td>
                  ))}
                  <td key={obj._id}>
                    <div className="flex gap-2 items-center justify-center p-2 ">
                      <NavLink to={`/flat-view/${obj._id}`} className="text-xs w-16 text-center bg-[#F1654D] p-1 rounded-md text-white font-semibold">
                        View flat
                      </NavLink>

                      <button
                        onClick={() => handleDeleteFlat(obj._id as string)}
                        className="text-xs w-16 text-center bg-[#F1654D] p-1 rounded-md text-white font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1 className="flex justify-center text-4xl font-semibold text-[#173466] items-center my-48">No flats added</h1>
      )}
    </>
  );
};

export default MyFlats;
