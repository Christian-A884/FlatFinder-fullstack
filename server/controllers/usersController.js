import userServices from "../services/userServices.js";
import flatService from "../services/flatService.js";
import bcrypt from "bcrypt";
import { isPasswordValid } from "../utils/validationRules.js";
import { isEmailValid, isUserBetween18and67 } from "../utils/validationRules.js";
import jwt from "jsonwebtoken";

const getUserById = async (req, res) => {
  const { _id } = req.user;

  if (_id.length !== 24) {
    return res.status(401).send({ message: "The entered id is not valid" });
  }

  try {
    const foundUser = await userServices.getUserBy({ _id: _id });

    if (!foundUser) {
      return res.status(404).send({ message: `No user with id ${_id} was found` });
    }
    const { email, firstName, lastName, birthdate, isAdmin, favouriteFlatList } = foundUser;
    return res.status(200).send({
      message: "User data was found",
      data: { email, firstName, lastName, birthdate, isAdmin, favouriteFlatList },
    });
  } catch (error) {
    return res.status(500).send({ message: "Error while getting data. Please refresh the page" });
  }
};

const getUserBySpecificId = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    return res.status(401).send({ message: "The entered id is not valid" });
  }

  try {
    const foundUser = await userServices.getUserBy({ _id: id });

    if (!foundUser) {
      return res.status(404).send({ message: `No user with id ${id} was found` });
    }
    const { email, firstName, lastName, birthdate, isAdmin } = foundUser;
    return res.status(200).send({
      message: "User data was found",
      data: { email, firstName, lastName, birthdate, isAdmin },
    });
  } catch (error) {
    return res.status(500).send({ message: "Error while getting data. Please refresh the page" });
  }
};

const updateUser = async (req, res) => {
  const { email, lastName, firstName, birthdate, password, confirmPassword } = req.body;
  const { id } = req.params;
  const { _id: userId, isAdmin } = req.user;
  const trimmedEmail = email.trim();

  if (!firstName?.trim() || !lastName?.trim() || !trimmedEmail || !birthdate) {
    return res.status(400).send({ message: "All fields are required" });
  }

  if (firstName.trim().length < 2) {
    return res.status(400).send({ message: "First name must have at least 2 characters" });
  }

  if (lastName.trim().length < 2) {
    return res.status(400).send({ message: "Last name must have at least 2 characters" });
  }

  if (!isEmailValid(trimmedEmail)) {
    return res.status(400).send({ message: "Invalid format of email address" });
  }

  if (password !== confirmPassword) {
    return res.status(400).send({ message: "The passwords don't match." });
  }

  if (!isUserBetween18and67(birthdate)) {
    return res.status(401).send({ message: "User age must be between 18 and 67 years old" });
  }

  try {
    const foundUserByEmail = await userServices.getUserBy({
      email: trimmedEmail,
    });
    const loggedUser = await userServices.getUserBy({ _id: userId });

    if (!loggedUser) {
      return res.status(404).send({ message: `No user with id ${userId} was found.` });
    }

    if (foundUserByEmail._id.toString() === id) {
      return res.status(409).send({ message: "Already used email" });
    }

    const newData = {
      _id: userId,
      email,
      lastName,
      firstName,
      birthdate,
      isAdmin,
    };
    if (password) {
      if (!isPasswordValid(password.trim())) {
        return res.status(400).send({ message: "Password doesn't fullfil all requirements" });
      }

      const newPassword = bcrypt.hashSync(password, 10);
      newData.password = newPassword;
    }
    await userServices.updateUser(userId, newData);
    const token = jwt.sign(newData, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("loggedUser", token, {
      maxAge: 604800000,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    return res.status(200).send({ message: "User profile updated", data: newData });
  } catch (error) {
    res.status(500).send({
      message: "An error occured while updating",
      error: error.message,
    });
  }
};

const updateUserbyAdmin = async (req, res) => {
  const { email, lastName, firstName, birthdate, password, confirmPassword, isAdmin } = req.body;
  const id = req.param.id;
  const trimmedEmail = email.trim();

  if (!firstName?.trim() || !lastName?.trim() || !trimmedEmail || !birthdate) {
    return res.status(400).send({ message: "All fields are required" });
  }

  if (firstName.trim().length < 2) {
    return res.status(400).send({ message: "First name must have at least 2 characters" });
  }

  if (lastName.trim().length < 2) {
    return res.status(400).send({ message: "Last name must have at least 2 characters" });
  }

  if (!isEmailValid(trimmedEmail)) {
    return res.status(400).send({ message: "Invalid format of email address" });
  }

  if (password !== confirmPassword) {
    return res.status(400).send({ message: "The passwords don't match." });
  }

  if (!isUserBetween18and67(birthdate)) {
    return res.status(401).send({ message: "User age must be between 18 and 67 years old" });
  }

  try {
    const foundUserByEmail = await userServices.getUserBy({ email });
    const userData = await userServices.getUserBy({ _id: id });

    if (!userData) {
      res.status(404).send({ message: `No user with id ${userId} was found.` });
    }

    if (foundUserByEmail.id !== id) {
      return res.status(409).send({ message: "Already used email" });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({ message: "The passwords don't match." });
    }

    const newData = {
      email,
      lastName,
      firstName,
      birthdate,
      isAdmin,
    };
    if (password) {
      if (!isPasswordValid(password.trim())) {
        return res.status(400).send({ message: "Password doesn't fullfil all requirements" });
      }
      const newPassword = bcrypt.hashSync(password, 10);
      newData.password = newPassword;
    }
    const updated = await userServices.updateUser(id, newData);
    return res.status(200).send({ message: "User profile updated", data: updated });
  } catch (error) {
    res.status(500).send({
      message: "An error occured while updating",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    return res.status(404).send({ message: "No logged user found" });
  }
  try {
    await flatService.deleteFlats(_id);
    await userServices.deleteUser(_id);
    res.status(200).send({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: "An error occured on delete procces",
      error: error.message,
    });
  }
};

const deleteUserByAdmin = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).send({ message: "No logged user found" });
  }
  try {
    await flatService.deleteFlats(id);
    await userServices.deleteUser(id);
    const users = await userServices.getAllUser();
    res.status(200).send({ message: "User account deleted successfully", data: users });
  } catch (error) {
    res.status(500).send({
      message: "An error occured on delete procces",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userServices.getAllUser();
    return res.status(200).send({
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error while getting data. Please refresh the page" });
  }
};

const addFlatToFavourites = async (req, res) => {
  const userId = req.user._id;
  const { flatId } = req.body;
  try {
    const favFlat = await userServices.addFlatToFavourites(userId, flatId);
    return res.status(200).send({ message: "Flat has been added to user favourite flats", data: favFlat });
  } catch (error) {
    res.status(500).send({
      message: "An error occured on delete procces",
      error: error.message,
    });
  }
};

const removeFlatFromFavourites = async (req, res) => {
  const userId = req.user._id;
  const { flatId } = req.body;
  try {
    const favFlat = await userServices.removeFlatFromFavourites(userId, flatId);
    return res.status(200).send({ message: "Flat has been removed to user favourite flats", data: favFlat });
  } catch (error) {
    res.status(500).send({
      message: "An error occured on delete procces",
      error: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  try {
    await userServices.updateUserIsAdmin(userId);
    res.status(200).send({ message: "User role updated" });
  } catch (error) {
    res.status(500).send({
      message: "An error occured on update procces",
      error: error.message,
    });
  }
};

export default {
  getUserById,
  getUserBySpecificId,
  getAllUsers,
  updateUser,
  updateUserbyAdmin,
  deleteUser,
  deleteUserByAdmin,
  addFlatToFavourites,
  removeFlatFromFavourites,
  updateUserRole,
};
