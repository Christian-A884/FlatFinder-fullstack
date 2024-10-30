import { SubmitHandler, useForm } from "react-hook-form";
import { loginUser } from "../api/methods/auth/users";
import { User } from "../interface";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserDataContext } from "../provider/userDatacontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerLoader from "../components/SpinnerLoader";
import logo from "../assets/flatFinder.png";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  const { setUserDetails } = useContext(UserDataContext);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      setIsLoading(true);
      const userCredentials = await loginUser(data);
      setUserDetails(userCredentials);

      toast.success("Login successfully");
      navigate("/");
    } catch (error) {
      toast.error("Please verify your email and/or password and try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {" "}
      {isLoading ? <SpinnerLoader /> : null}
      <div className="flex min-h-[1024px] justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center w-full h-auto gap-6 my-36 px-10 sm:px-20 md:px-20 mx-auto max-w-[1000px] "
        >
          <Link to="/">
            <img src={logo} className="h-[80px]" alt="logo" />
          </Link>
          <h3 className="m-4 text-2xl text-center font-semibold">Login to your account</h3>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1 ">
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
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password length must be at least 6 charachters",
                },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&*!])[a-zA-Z\d@#$%^&*!]{6,}$/,

                  message: "Password must contain at least one uppercase letter,one number and one special character",
                },
              })}
              className="h-10 w-full border border-gray-500 rounded-md pl-2 text-sm placeholder:text-sm"
              type="password"
              placeholder="Password"
              id="password"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.password && (errors.password.message as string)}</p>
          </div>
          <button className="bg-[#F1654D] text-white hover:text-gray-200 text-lg  font-semibold w-full h-10 rounded-md" type="submit">
            Login
          </button>
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-32">
            <button className="text-base text-[#F1654D] font-semibold underline mt-2">
              <Link to="/register">Don't have an account? SignUp! </Link>
            </button>
            <button className="text-base text-[#F1654D] font-semibold underline mt-2">
              <Link to="/forgot-password">Forgot your password? </Link>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
