import { useState } from "react";
import { ChangeEvent } from "react";
import { User } from "../interface";
import SpinnerLoader from "./SpinnerLoader";
import { useNavigate } from "react-router";

//syntax which shows a form that is used to collect user data that will be updated in firebase users collection, for a specific user

interface UserFilterProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserFilter = ({ users, setUsers }: UserFilterProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [userFilter, setUserFilter] = useState({
    userType: "",
    minAge: "",
    maxAge: "",
    minFlat: "",
    maxFlat: "",
  });

  const [userSort, setUserSort] = useState({
    criteria: "Lastname",
    order: "Ascending",
  });
  const navigate = useNavigate();
  const handleUserFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserSort({
      ...userSort,
      [name]: value,
    });
  };

  const filterUser = (user: User[]) => {
    return user.filter((item) => {
      return (
        userFilter.userType === "" ||
        (item.isAdmin &&
          (userFilter.minAge === "" || item.age >= parseFloat(userFilter.minAge)) &&
          (userFilter.maxAge === "" || item.age <= parseFloat(userFilter.maxAge)) &&
          (userFilter.minFlat === "" || item.userFlatCount >= parseFloat(userFilter.minFlat)) &&
          (userFilter.maxFlat === "" || item.userFlatCount <= parseFloat(userFilter.maxAge)))
      );
    });
  };

  const sortUser = (user: User[]) => {
    return user.slice().sort((a, b) => {
      let fieldA: number | string, fieldB: number | string;
      switch (userSort.criteria) {
        case "Flats added":
          fieldA = a.userFlatCount;
          fieldB = b.userFlatCount;
          break;
        case "Firstname":
          fieldA = a.firstName.toLowerCase();
          fieldB = b.firstName.toLowerCase();
          break;
        default:
          fieldA = a.lastName.toLowerCase();
          fieldB = b.lastName.toLowerCase();
      }

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return userSort.order === "Ascending" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === "number" && typeof fieldB === "number") {
        return userSort.order === "Ascending" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });
  };

  const handleUserFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(filterUser(users));
      setIsLoading(false);
    }, 1000);
  };

  const handleClearFilter = () => {
    navigate(0);
  };

  const handleUserSort = () => {
    setUsers(sortUser(users));
  };

  return (
    <>
      {isLoading && <SpinnerLoader />}
      <div className="flex justify-center md:flex-col md:justify-start xl:flex-row gap-5 mt-10">
        <div className="flex flex-col w-full xs:w-[60%] justify-start md:items-start md:flex-row px-4 md:w-full mdl:w-[90%]  gap-3 ">
          <div className="flex flex-col text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="userType">
              User Type:{" "}
            </label>
            <select
              className="border text-gray-400 text-sm h-5 w-28 px-2"
              name="userType"
              onChange={(e) => handleUserFilterChange(e)}
              value={userFilter.userType}
            >
              <option value="">Select an user type</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="flex flex-col mdl:items-center text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="minAge">
              Age range
            </label>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="minAge"
                type="number"
                placeholder="min age"
                value={userFilter.minAge}
                onChange={(e) => handleUserFilterChange(e)}
              />
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="maxAge"
                type="number"
                placeholder="max age"
                value={userFilter.maxAge}
                onChange={(e) => handleUserFilterChange(e)}
              />
            </div>
          </div>
          <div className="flex flex-col  text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="minFlat">
              Added flats range
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="minflats"
                type="number"
                placeholder="min flats number"
                value={userFilter.minFlat}
                onChange={(e) => handleUserFilterChange(e)}
              />
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="maxflats"
                type="number"
                placeholder="max flats number"
                value={userFilter.maxFlat}
                onChange={(e) => handleUserFilterChange(e)}
              />
            </div>
          </div>
          <div className="flex gap-3 w-40 mdl:items-center mdl:justify-center mdl:p-2">
            <button onClick={handleUserFilter} className="text-[14px] text-center bg-[#F1654D] p-1 mt-2 rounded-md text-white font-semibold">
              Filter
            </button>
            <button onClick={handleClearFilter} className="text-[14px] text-center bg-[#F1654D] p-1 mt-2 rounded-md text-white font-semibold">
              Clear filter
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start w-full md:flex-row px-4 gap-3">
          <div className="flex flex-col text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="minPrice">
              Sort by:
            </label>
            <select className="border text-gray-400 text-sm" name="criteria" value={userSort.criteria} onChange={(e) => handleUserSortChange(e)}>
              <option value="Lastname">Lastname</option>
              <option value="Firstname">Firstname</option>
              <option value="Flats added">Flats added</option>
            </select>
          </div>
          <div className="flex flex-col text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="minPrice">
              Option
            </label>
            <select className="border text-gray-400 text-sm" name="order" value={userSort.order} onChange={(e) => handleUserSortChange(e)}>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          <div className="items-center justify-center">
            <button
              onClick={handleUserSort}
              className="text-[14px] h-8 items-center justify-center text-center bg-[#F1654D] p-1 rounded-md text-white font-semibold mt-3"
            >
              Sort
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFilter;
