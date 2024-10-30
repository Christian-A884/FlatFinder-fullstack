import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { registerUserMongo } from "../api/methods/auth/users";
import { User } from "../interface";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLoader from "../components/SpinnerLoader";
import logo from "../assets/flatFinder.png";
import calculateUserAge from "../api/methods/auth/users";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>();
  const [birthdate, setBirthDate] = useState("");
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      setIsLoading(true);
      toast.info("Creating your account. Please wait!");
      await registerUserMongo(data);
      toast.success("Your account is crerated");
      navigate("/login");
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
  };

  return (
    <>
      {isLoading ? <SpinnerLoader /> : null}
      <div className="h-[960px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center w-full h-auto mt-20 px-16 mb-16 sm:px-32 md:px-32 mx-auto max-w-[1024px] "
        >
          <Link to="/">
            <img src={logo} className="h-[80px]" alt="logo" />
          </Link>
          <h3 className="m-4 text-2xl text-center font-semibold">Create your account</h3>
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
            <p className="text-[12px] h-6 text-red-600">{errors.firstName && (errors.firstName.message as string)}</p>
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
            <p className="text-[12px] h-6 text-red-600">{errors.lastName && (errors.lastName.message as string)}</p>
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
            <p className="text-[12px] h-6 text-red-600">{errors.email && (errors.email.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full  text-base gap-1">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
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
              type="password"
              placeholder="Password"
              id="password"
            />
            <p className="text-[12px] h-6 text-red-600">{errors.password && (errors.password.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              {...register("confirmPassword", {
                validate: (value) => value === password || "The passwords doesn't match",
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
            />
            <p className="text-[12px] h-6 text-red-600">{errors.confirmPassword && (errors.confirmPassword.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1">
            <label htmlFor="birthday">Birthday</label>
            <input
              {...register("birthdate", {
                required: "This field is required",

                validate: (value) => (calculateUserAge(value) >= 18 && calculateUserAge(value) <= 67) || "Age must be between 18 and 67",
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="date"
              placeholder="Birthday"
              name="birthdate"
              onChange={handleInputChange}
              value={birthdate}
            />
            <p className="text-[12px] h-6 text-red-600">{errors.birthdate && (errors.birthdate.message as string)}</p>
          </div>
          <button className="bg-[#F1654D] text-white text-lg hover:text-gray-200  font-semibold w-full h-10 rounded-md" type="submit">
            Create my account
          </button>
          <button className="text-base text-[#F1654D] font-semibold underline mt-2">
            <Link to="/login">Already have an account? Please login! </Link>
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
