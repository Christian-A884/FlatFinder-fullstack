import { isUserBetween18and67, isEmailValid, isPasswordValid } from "../utils/validationRules.js";
import bcrypt from "bcrypt";
import userServices from "../services/userServices.js";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, birthdate } = req.body;
  const trimmedEmail = email.trim();

  if (!firstName?.trim() || !lastName?.trim() || !trimmedEmail || !password?.trim() || !confirmPassword?.trim() || !birthdate) {
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

  if (!isPasswordValid(password.trim())) {
    return res.status(400).send({ message: "Password doesn't fullfil all requirements" });
  }

  if (password !== confirmPassword) {
    return res.status(400).send({ message: "The passwords don't match." });
  }

  if (!isUserBetween18and67(birthdate)) {
    return res.status(401).send({ message: "User age must be between 18 and 67 years old" });
  }

  try {
    const isEmailAlreadyExisting = await userServices.isEmailUsed(trimmedEmail);
    if (isEmailAlreadyExisting) {
      return res.status(409).send({ message: "This email address is already used" });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await userServices.addUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthdate,
      });
      res.status(201).send({ message: "Account registered successfully" });
    }
  } catch (error) {
    res.status(500).send({ message: "An error has occured while registering" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !isPasswordValid(password)) {
    return res.status(400).send({ message: "All fields are mandatory" });
  }
  try {
    const user = await userServices.getUserBy({ email });

    if (!user) {
      return res.status(404).send({ message: "No user was found with this email address" });
    } else {
      const userPassword = user.password;
      const arePasswordMatch = bcrypt.compareSync(password, userPassword);
      if (!arePasswordMatch) {
        return res.status(404).send({ message: "Wrong password. Please try again" });
      } else {
        delete user.password;

        const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        res.cookie("loggedUser", token, {
          maxAge: 604800000,
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        });
        return res.status(200).send({
          message: "Login successfull",
          data: user,
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "An error has occured while authenticating" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("loggedUser", {
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "An error has occured during the logout process" });
  }
};

const checkSession = async (req, res) => {
  const token = req.cookies["loggedUser"];
  if (!token) {
    return res.status(403).send({ message: "Authentication required " });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    res.status(200).send({ message: "You are logged in.", data: decoded });
  } catch (error) {
    return res.status(401).send({ message: "Token invalid" });
  }
};

const sendPasswordLink = async (req, res) => {
  const { email } = req.body;
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return res.status(400).send({ message: "All fields are mandatory" });
  }

  try {
    const user = await userServices.getUserBy({ email });
    if (!user) {
      return res.status(404).send({ message: "No user was found with this email address" });
    }

    const token = jwt.sign({ email: trimmedEmail }, process.env.SECRET_KEY, { expiresIn: "1h" });

    const resetLink = "http://localhost:5173/reset-password/" + token;
    sgMail.setApiKey(process.env.SENDGRID_KEY);

    const msg = {
      to: email,
      from: "cristialbu111@gmail.com",
      subject: "Reset Password Link for FlatFinder.com",
      html: `<a href="${resetLink}">This is your reset link</a>`,
    };
    await sgMail.send(msg);
    return res.status(200).send({
      message: "The reset password mail has been sent to you. Please check your inbox.",
    });
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  const trimmmedNewPassword = newPassword.trim();
  const trimmmedConfirmPassword = confirmPassword.trim();

  try {
    const decodedUser = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedUser.email) {
      return res.status(404).send({ message: "Reset password link is not valid. Please try again." });
    }

    if (!isPasswordValid(trimmmedNewPassword)) {
      return res.status(400).send({ message: "Password doesn't fullfil all requirements" });
    }

    if (trimmmedNewPassword !== trimmmedConfirmPassword) {
      return res.status(400).send({ message: "The passwords don't match." });
    }
    const hashedPassword = bcrypt.hashSync(trimmmedNewPassword, 10);
    await userServices.resetPassword(decodedUser.email, hashedPassword);
    res.status(200).send({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).send({ message: "Your reset password link has expired" });
  }
};

export default { registerUser, loginUser, logoutUser, checkSession, sendPasswordLink, resetPassword };
