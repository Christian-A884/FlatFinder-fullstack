import { FieldValues } from "react-hook-form";
import { User } from "../../../interface";
import axios from "axios";

export default function calculateUserAge(birthDate: string) {
  const currentDate = new Date();
  const birthday = new Date(birthDate);
  const ageInMilliseconds = currentDate.getTime() - birthday.getTime();
  const userAgeResult = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));

  return userAgeResult;
}

export const registerUserMongo = async (userData: User) => {
  try {
    await axios.post(
      "http://localhost:4000/api/auth/register",
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        birthdate: userData.birthdate,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      },
      { withCredentials: true }
    );
  } catch (error: any) {
    throw error.response.message.data;
  }
};

export const loginUser = async (userData: User) => {
  try {
    const result = await axios.post(
      "http://localhost:4000/api/auth/login",
      { email: userData.email, password: userData.password },
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await axios.post("http://localhost:4000/api/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    throw error;
  }
};

export const checkSession = async () => {
  try {
    const result = await axios.get("http://localhost:4000/api/auth/checkoutSession", { withCredentials: true });
    return result.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (_id: string) => {
  try {
    const result = await axios.get(`http://localhost:4000/api/users/profile/${_id}`, { withCredentials: true });
    return result.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSpecificUserData = async (_id: string) => {
  try {
    const result = await axios.get(`http://localhost:4000/api/guestUser/users/${_id}`, { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateUser = async (userData: User) => {
  try {
    const result = await axios.put(
      "http://localhost:4000/api/users/profile/",
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        birthdate: userData.birthdate,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      },
      { withCredentials: true }
    );

    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const updateUserRole = async (id: string) => {
  try {
    const result = await axios.put(`http://localhost:4000/api/users/updateUserRole/${id}`, {}, { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const getAllUsers = async () => {
  try {
    const result = await axios.get("http://localhost:4000/api/users/admin/", { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const deleteUser = async () => {
  try {
    const result = await axios.delete("http://localhost:4000/api/users/profile/", { withCredentials: true });
    return result.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserByAdmin = async (id: string) => {
  try {
    const result = await axios.delete(`http://localhost:4000/api/users/admin/${id}`, { withCredentials: true });
    return result.data.data;
  } catch (error) {
    throw error;
  }
};

export const addFavouriteUserFlat = async (flatId: string) => {
  try {
    const result = await axios.put(
      "http://localhost:4000/api/users/addFavouriteUserFlat",
      {
        flatId: flatId,
      },
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const removeFavouriteUserFlat = async (flatId: string) => {
  try {
    const result = await axios.put(
      "http://localhost:4000/api/users/removeFavouriteUserFlat",
      {
        flatId: flatId,
      },
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const sendPasswordLink = async (email: string) => {
  try {
    const result = await axios.post("http://localhost:4000/api/reset-password/request", { email }, { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const resetPassword = async (data: FieldValues, token: string) => {
  try {
    const result = await axios.post(`http://localhost:4000/api/reset-password/reset/${token}`, data, { withCredentials: true });
    return result.data.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};
