import User from "../models/userModel.js";

const addUser = async (user) => {
  try {
    await User.create(user);
  } catch (error) {
    throw error;
  }
};

const isEmailUsed = async (email) => {
  try {
    const result = await User.exists({ email });

    return result;
  } catch (error) {
    throw error;
  }
};

const getUserBy = async (data) => {
  try {
    return await User.findOne(data).populate({ path: "favouriteFlatList", select: "_id" });
  } catch (error) {
    throw error;
  }
};

const updateUser = async (idOfUserToUpdate, newData) => {
  try {
    await User.updateOne(
      {
        _id: idOfUserToUpdate,
      },
      {
        $set: {
          email: newData.email,
          lastName: newData.lastName,
          firstName: newData.firstName,
          birthdate: newData.birthdate,
          password: newData.password,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (idOfUserToDelete) => {
  try {
    await User.deleteOne({ _id: idOfUserToDelete });
  } catch (error) {
    throw error;
  }
};

const getAllUser = async () => {
  try {
    const allUsers = await User.find();
    return allUsers;
  } catch (error) {
    throw error;
  }
};

const addFlatToFavourites = async (userId, flatId) => {
  try {
    await User.findByIdAndUpdate({ _id: userId }, { $addToSet: { favouriteFlatList: flatId } }, { new: true });
  } catch (error) {
    throw error;
  }
};

const removeFlatFromFavourites = async (userId, flatId) => {
  try {
    await User.findByIdAndUpdate({ _id: userId }, { $pull: { favouriteFlatList: flatId } }, { new: true });
  } catch (error) {
    throw error;
  }
};

const updateUserIsAdmin = async (userId) => {
  try {
    const currentData = await User.findById(userId);
    currentData.isAdmin = !currentData.isAdmin;
    await currentData.save();
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    user.password = password;
    await user.save();
  } catch (error) {
    throw error;
  }
};

export default {
  addUser,
  isEmailUsed,
  getUserBy,
  updateUser,
  deleteUser,
  getAllUser,
  addFlatToFavourites,
  removeFlatFromFavourites,
  updateUserIsAdmin,
  resetPassword,
};
