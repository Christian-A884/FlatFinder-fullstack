import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import logo from "../assets/flatFinder.png";
import { toast } from "react-toastify";
import { resetPassword } from "../api/methods/auth/users";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const onSubmit = async (data: FieldValues) => {
    try {
      await resetPassword(data, token as string);
      toast.success("Password has been reset");
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const newPassword = watch("newPassword");

  return (
    <>
      <div className="flex h-[1024px] justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-full h-auto my-36 px-4 sm:px-20 md:px-52 mx-auto max-w-[1098px] "
        >
          <Link to="/">
            <img src={logo} className="h-[80px] mb-10" alt="logo" />
          </Link>
          <h3 className="m-4 text-xl text-center font-semibold">Please enter your new password</h3>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1 ">
            <label htmlFor="newPassword">New password</label>
            <input
              {...register("newPassword", {
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
              className="h-8 w-full border border-gray-500 rounded-md pl-2 text-xs placeholder:text-sm"
              type="password"
              placeholder="New password"
              id="newPassword"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.newPassword && (errors.newPassword.message as string)}</p>
          </div>
          <div className="flex flex-col justify-center items-start w-full text-base gap-1 ">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              {...register("confirmPassword", {
                validate: (value) => value === newPassword || "The passwords doesn't match",
              })}
              className="h-8 w-full border border-gray-500 rounded-md pl-2 text-xs placeholder:text-sm"
              type="password"
              placeholder="Confirm new Password"
              id="confirmPassword"
            />
            <p className="text-[10px] h-6 text-red-600">{errors.confirmNewPassword && (errors.confirmNewPassword.message as string)}</p>
          </div>
          <button className="bg-[#F1654D] text-white text-base hover:text-gray-200   font-semibold w-full h-8 rounded-md" type="submit">
            Reset password
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
