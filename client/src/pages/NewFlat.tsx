import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Flat } from "../interface";
import { addNewFlat } from "../api/methods/flats/flats";
import { toast } from "react-toastify";
import { useState } from "react";

const NewFlat = () => {
  const [file, setFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Flat>();
  const navigate = useNavigate();

  const handleCancelButton = () => {
    navigate("/my-flats");
  };
  const onSubmit: SubmitHandler<Flat> = async (data) => {
    try {
      const formData = new FormData();
      if (file !== null) {
        formData.append("photo", file[0]);
      }
      for (const key in data) {
        formData.append(key, data[key] as string);
      }
      await addNewFlat(formData);
      navigate("/my-flats");
      toast.success("New flat added");
    } catch (error: any) {
      toast.error(error.message);
      throw new Error("An error occured while add process");
    }
  };

  const handleSelect = (e: any) => {
    setFile(e.target.files);
  };

  return (
    <div className="h-[960px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center w-full h-full px-20 sm:px-28 md:px-52 mx-auto max-w-[1024px] "
      >
        <h3 className="m-4 text-2xl text-center font-semibold">Add new flat</h3>
        <div className="flex flex-col justify-center items-start w-full text-base gap-1">
          <label htmlFor="city">City</label>
          <input
            {...register("city", {
              required: { value: true, message: "This field is required" },
            })}
            type="text"
            className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
            placeholder="City"
            id="firstName"
          />
          <p className="text-[12px] h-6 text-red-600">{errors.city && errors.city.message}</p>
        </div>
        <div className="flex w-full gap-4 justify-between">
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="streetName">Street name</label>
            <input
              {...register("streetName", {
                required: { value: true, message: "This field is required" },
              })}
              type="text"
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              placeholder="Street name"
              id="fstreetName"
            />
            <p className="text-[12px] h-6 text-red-600">{errors.streetName && errors.streetName.message}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="streetNumber">Street number</label>
            <input
              {...register("streetNumber", {
                required: { value: true, message: "This field is required" },
              })}
              type="string"
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              placeholder="Street number"
              id="streetNumber"
            />
            <p className="text-[12px] h-6 text-red-600">{errors.streetNumber && errors.streetNumber.message}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start w-full text-base gap-1">
          <label htmlFor="areaSize">Area size</label>
          <input
            {...register("areaSize", {
              required: { value: true, message: "This field is required" },
            })}
            type="number"
            className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
            placeholder="Area size"
            id="areaSize"
          />
          <p className="text-[12px] h-6 text-red-600">{errors.areaSize && errors.areaSize.message}</p>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="hasAC">Has AC</label>
            <input
              {...register("hasAC")}
              type="checkbox"
              className="h-6 w-10 items-start border border-gray-500 rounded-md pl-4 text-xs placeholder:text-xs"
              placeholder="Has AC"
              id="hasAC"
            />
            <p className="text-[12px] h-6 text-red-600">{errors.hasAC && errors.hasAC.message}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="yearBuilt">Year Built</label>
            <input
              {...register("yearBuilt", {
                required: { value: true, message: "This field is required" },
              })}
              type="number"
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              placeholder="Year Built"
              id="yearBuilt"
            />
            <p className="text-[12px] h-6 text-red-600">{errors.yearBuilt && errors.yearBuilt.message}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start w-full text-base gap-1">
          <label htmlFor="rentPrice">Rent price</label>
          <input
            {...register("rentPrice", {
              required: { value: true, message: "This field is required" },
            })}
            type="text"
            className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
            placeholder="Rent price"
            id="rentPrice"
          />
          <p className="text-[12px] h-6 text-red-600">{errors.rentPrice && errors.rentPrice.message}</p>
        </div>
        <div className="flex flex-col justify-center items-start w-full text-base gap-1">
          <label htmlFor="description">Description</label>
          <input
            {...register("description", {
              required: { value: true, message: "This field is required" },
            })}
            type="text"
            className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
            placeholder="Description"
            id="description"
          />
          <p className="text-[12px] h-6 text-red-600">{errors.description && errors.description.message}</p>
        </div>
        <div className="flex flex-col justify-center items-start w-full text-base gap-1">
          <label htmlFor="dateAvailable">Date available</label>
          <input
            {...register("dateAvailable", {
              required: { value: true, message: "This field is required" },
            })}
            type="Date"
            className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
            placeholder="Date available"
            id="dateAvailable"
          />
          <p className="text-[12px] h-6 text-red-600">{errors.dateAvailable && errors.dateAvailable.message}</p>
        </div>
        <div className="flex flex-col justify-center items-start w-full text-base gap-1">
          <label htmlFor="photoURL">Flat image</label>
          <input onChange={handleSelect} type="file" className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm" />
          <p className="text-[12px] h-6 text-red-600">{errors.photoURL && errors.photoURL.message}</p>
        </div>
        <div className="flex w-full gap-6 justify-between">
          <button className="bg-[#F1654D] text-white text-sm  font-semibold w-[50%] h-10 rounded-md mb-4" type="submit">
            Add new flat
          </button>
          <button className="bg-[#F1654D] text-white text-sm  font-semibold w-[50%] h-10 rounded-md mb-4" type="submit" onClick={handleCancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewFlat;
