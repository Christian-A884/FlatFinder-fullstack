import express from "express";
import loggedMiddleware from "../middlewares/loggedMiddleware.js";
import usersController from "../controllers/usersController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const usersRouter = express.Router();

usersRouter.get("/profile/:id", loggedMiddleware, usersController.getUserById);

usersRouter.get("/admin/", loggedMiddleware, adminMiddleware, usersController.getAllUsers);
usersRouter.put("/profile/", loggedMiddleware, usersController.updateUser);
usersRouter.put("/profile/:id", loggedMiddleware, adminMiddleware, usersController.updateUserbyAdmin);
usersRouter.put("/addFavouriteUserFlat", loggedMiddleware, usersController.addFlatToFavourites);
usersRouter.put("/removeFavouriteUserFlat", loggedMiddleware, usersController.removeFlatFromFavourites);
usersRouter.delete("/profile/", loggedMiddleware, usersController.deleteUser);
usersRouter.put("/updateUserRole/:id", loggedMiddleware, adminMiddleware, usersController.updateUserRole);

usersRouter.delete("/admin/:id", loggedMiddleware, adminMiddleware, usersController.deleteUserByAdmin);

export default usersRouter;
