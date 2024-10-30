import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "../interface";
import { useNavigate } from "react-router";
import { updateUser } from "../api/methods/auth/users";
import { toast } from "react-toastify";
import SpinnerLoader from "../components/SpinnerLoader";
import { UserDataContext } from "../provider/userDatacontext";

const EditProfileModal = ({
  closeModal,
  userData,
  setUserData,
  setUserDetails,
}: {
  closeModal: () => void;
  userData: User;
  setUserData: (userDetails: User) => void;
  setUserDetails: (userDetails: User) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // const { setUserDetails } = useContext(UserDataContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>({ defaultValues: userData });
  const [birthdate, setBirthdate] = useState("");
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      setIsLoading(true);
      toast.info("Updating your account. Please wait!");
      const updatedUser = await updateUser(data);
      setUserData(updatedUser);
      setUserDetails(updatedUser);
      closeModal();
      navigate("/");
      toast.success("Your account is updated");
    } catch (error: unknown) {
      toast.error((error as Error).message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");

  function calculateAge(birthDate: string) {
    const currentDate = new Date();
    const birthday = new Date(birthDate);
    const ageInMilliseconds = currentDate.getTime() - birthday.getTime();
    const ageResult = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));

    return ageResult;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthdate(e.target.value);
  };

  return (
    <>
      {isLoading ? <SpinnerLoader /> : null}
      <div className="flex absolute w-[80%] h-full align-center justify-center left-[50%] right-[50%] -translate-x-1/2 translate-y-[5%] mx-auto bg-white drop-shadow-lg rounded-2xl ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center w-full h-full px-10 pb-4  md:px-36 lg:px-40 xl:px-52 mx-auto max-w-[1098px] "
        >
          <h3 className="mb-4 text-2xl text-center font-semibold">Update your account</h3>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="firstName">Firstname</label>
            <input
              {...register("firstName", {
                required: { value: true, message: "This field is required" },
                minLength: {
                  value: 2,
                  message: "Firstname should have at least 2 characters",
                },
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="text"
              placeholder="First Name"
              id="firstName"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.firstName && (errors.firstName.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full  text-base gap-1">
            <label htmlFor="lasttName">Lastname</label>
            <input
              {...register("lastName", {
                required: { value: true, message: "This field is required" },
                minLength: {
                  value: 2,
                  message: "Lastname should have at least 2 characters",
                },
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="text"
              placeholder="Last Name"
              id="lastName"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.lastName && (errors.lastName.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="email">Email address</label>
            <input
              {...register("email", {
                required: "Email is required",
                validate: {
                  isEmail: (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || "Invalid email format",
                },
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="text"
              placeholder="Email address"
              id="email"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.email && (errors.email.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full  text-base gap-1">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password length must be at least 6 charachters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                  message: "Password must contain at least one uppercase letter,one number and one special character",
                },
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="text"
              placeholder="Password"
              id="password"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.password && (errors.password.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              {...register("confirmPassword", {
                validate: (value) => (password ? value === password || "The passwords doesn't match" : true),
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="text"
              placeholder="Confirm Password"
              id="confirmPassword"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.confirmPassword && (errors.confirmPassword.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="birthday">Birthday</label>
            <input
              {...register("birthdate", {
                validate: (value) => (calculateAge(value) >= 18 && calculateAge(value) <= 120) || "Age must be between 18 and 120 years old",
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="date"
              placeholder="Birthday"
              name="birthdate"
              onChange={handleInputChange}
              value={birthdate}
            />
            <p className="text-[10px] h-6 text-red-600">{errors.birthdate && (errors.birthdate.message as string)}</p>
          </div>
          <div className="flex w-full gap-6 justify-between">
            <button className="bg-[#F1654D] text-white text-xs  font-semibold w-[50%] h-8 rounded-md mb-4" type="submit">
              Update
            </button>
            <button onClick={closeModal} className="bg-[#F1654D] text-white text-xs  font-semibold w-[50%] h-8 rounded-md mb-4" type="submit">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfileModal;
