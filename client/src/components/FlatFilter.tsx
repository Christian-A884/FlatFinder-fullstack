import { useState, ChangeEvent, useContext } from "react";
import { FlatContext } from "../provider/flatcontext";
import { Flat } from "../interface";
import SpinnerLoader from "./SpinnerLoader";

const FlatFilter = () => {
  const { flat, setFlat } = useContext(FlatContext);
  const [isLoading, setIsLoading] = useState(false);
  const [flatFilter, setFlatFilter] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
  });

  const [flatSort, setFlatSort] = useState({
    criteria: "City",
    order: "Ascending",
  });

  const handleFlatFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFlatFilter({
      ...flatFilter,
      [name]: value,
    });
  };

  const handleFlatSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlatSort({
      ...flatSort,
      [name]: value,
    });
  };

  const filterFlat = (flat: Flat[]) => {
    return flat.filter((item) => {
      return (
        (flatFilter.city === "" || item.city.toLowerCase().includes(flatFilter.city.toLowerCase())) &&
        (flatFilter.minPrice === "" || item.rentPrice >= parseFloat(flatFilter.minPrice)) &&
        (flatFilter.maxPrice === "" || item.rentPrice <= parseFloat(flatFilter.maxPrice)) &&
        (flatFilter.minArea === "" || item.areaSize >= parseFloat(flatFilter.minArea)) &&
        (flatFilter.maxArea === "" || item.areaSize <= parseFloat(flatFilter.maxArea))
      );
    });
  };

  const sortFlat = (flat: Flat[]) => {
    return flat.slice().sort((a, b) => {
      let fieldA: number | string, fieldB: number | string;
      switch (flatSort.criteria) {
        case "Price":
          fieldA = a.rentPrice;
          fieldB = b.rentPrice;
          break;
        case "Area Size":
          fieldA = a.areaSize;
          fieldB = b.areaSize;
          break;
        default:
          fieldA = a.city.toLowerCase();
          fieldB = b.city.toLowerCase();
      }

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return flatSort.order === "Ascending" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === "number" && typeof fieldB === "number") {
        return flatSort.order === "Ascending" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });
  };

  const handleFlatFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setFlat(filterFlat(flat));
      setIsLoading(false);
    }, 1000);
  };

  const handleClearFilter = () => {
    window.location.reload();
  };

  const handleFlatSort = () => {
    setFlat(sortFlat(flat));
  };

  return (
    <>
      {isLoading && <SpinnerLoader />}
      <div className="flex justify-center md:justify-start md:flex-col xl:flex-row gap-5">
        <div className="flex flex-col w-full xs:w-[60%] justify-start md:items-start md:flex-row px-4 md:w-full mdl:w-[90%]  gap-3 ">
          <div className="flex flex-col text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="city">
              City:{" "}
            </label>
            <input
              className="border placeholder: h-5 w-28 p-2"
              name="city"
              type="text"
              placeholder="City"
              value={flatFilter.city}
              onChange={(e) => handleFlatFilterChange(e)}
            />
          </div>
          <div className="flex flex-col mdl:items-center text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="minPrice">
              Rent price range
            </label>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="minPrice"
                type="number"
                placeholder="min price"
                value={flatFilter.minPrice}
                onChange={(e) => handleFlatFilterChange(e)}
              />
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="maxPrice"
                type="number"
                placeholder="max price"
                value={flatFilter.maxPrice}
                onChange={(e) => handleFlatFilterChange(e)}
              />
            </div>
          </div>
          <div className="flex flex-col mdl:items-center text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="">
              Area size range
            </label>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="minArea"
                type="number"
                placeholder="min area"
                value={flatFilter.minArea}
                onChange={(e) => handleFlatFilterChange(e)}
              />
              <input
                className="border placeholder: h-5 w-28 p-2"
                name="maxArea"
                type="number"
                placeholder="max area"
                value={flatFilter.maxArea}
                onChange={(e) => handleFlatFilterChange(e)}
              />
            </div>
          </div>
          <div className="flex gap-3 w-40 mdl:items-center mdl:justify-center mdl:p-2">
            <button
              onClick={handleFlatFilter}
              className=" text-[12px] mdl:text-[14px] text-center bg-[#F1654D] p-1 mt-2 rounded-md text-white font-semibold"
            >
              Filter
            </button>
            <button
              onClick={handleClearFilter}
              className="text-[12px] mdl:text-[14px] w-22 text-center bg-[#F1654D] p-1 mt-2 rounded-md text-white font-semibold"
            >
              Clear filter
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start w-full md:flex-row px-4 gap-3">
          <div className="flex flex-col text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="minPrice">
              Sort by:
            </label>
            <select className="border text-gray-400 text-sm" name="criteria" value={flatSort.criteria} onChange={(e) => handleFlatSortChange(e)}>
              <option value="City">City</option>
              <option value="Price">Price</option>
              <option value="Area Size">Area Size</option>
            </select>
          </div>
          <div className="flex flex-col text-sm gap-1">
            <label className="font-semibold text-[#F1654D]" htmlFor="minPrice">
              Option
            </label>
            <select className="border text-gray-400 text-sm" name="order" value={flatSort.order} onChange={(e) => handleFlatSortChange(e)}>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>
          <button
            onClick={handleFlatSort}
            className="text-[14px] h-8 align-center justify-center text-center bg-[#F1654D] p-1 mt-2 rounded-md text-white font-semibold"
          >
            Sort
          </button>
        </div>
      </div>
    </>
  );
};

export default FlatFilter;
