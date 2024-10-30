import express from "express";
import loggedMiddleware from "../middlewares/loggedMiddleware.js";
import flatsController from "../controllers/flatsController.js";
import messageController from "../controllers/messageController.js";
import photoUploadController from "../controllers/photoUploadController.js";

import multer from "multer";

const flatsRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "utils/flatPhotos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

flatsRouter.post("/addFlat", loggedMiddleware, upload.single("photo"), flatsController.addFlat);
flatsRouter.post("/newMessage/:flatId", loggedMiddleware, messageController.sendMessage);
flatsRouter.get("/userFlats", loggedMiddleware, flatsController.getUserFlats);
flatsRouter.put("/updateFlat/:id", loggedMiddleware, upload.single("photo"), flatsController.updateFlat);
flatsRouter.delete("/deleteFlat/:id", loggedMiddleware, flatsController.deleteFlat);
flatsRouter.get("/messages/:id", loggedMiddleware, messageController.getMessagebyFlatId);
flatsRouter.post("/flatPhotos", photoUploadController.uploadPhoto);
export default flatsRouter;
