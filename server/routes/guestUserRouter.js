import express from "express";
import flatsController from "../controllers/flatsController.js";
import usersController from "../controllers/usersController.js";

const guestUserRouter = express.Router();

guestUserRouter.get("/users/:id", usersController.getUserBySpecificId);
guestUserRouter.get("/flats", flatsController.getAllFlats);
guestUserRouter.get("/flat/:id", flatsController.getFlatbyId);

export default guestUserRouter;
