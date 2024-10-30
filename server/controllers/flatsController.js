import flatService from "../services/flatService.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getAllFlats = async (req, res) => {
  try {
    const allFlats = await flatService.getAllFlats();
    return res.status(200).send({ message: "Flats retrieved successfully", data: allFlats });
  } catch (error) {
    return res.status(500).send({ message: "Error while getting data. Please refresh the page" });
  }
};

const getFlatbyId = async (req, res) => {
  const id = req.params.id;

  if (id.length !== 24) {
    return res.status(401).send({ message: "The entered id is not valid" });
  }
  const flatId = ObjectId.createFromHexString(id);

  try {
    const foundFlat = await flatService.getFlatById(flatId);
    if (!foundFlat) {
      return res.status(404).send({ message: `Flat with id ${flatId} not found` });
    }
    return res.status(200).send({ message: "Flat retrieved successfully.", data: foundFlat });
  } catch (error) {
    return res.status(500).send({ message: "Error while getting data. Please refresh the page" });
  }
};

const getUserFlats = async (req, res) => {
  const ownerId = req.user._id;

  try {
    const foundUserFlats = await flatService.getUserFlats(ownerId);
    if (!foundUserFlats) {
      return res.status(404).send({ message: "No flat has been found" });
    }
    res.status(200).send({ message: "Flats retrieved successfully", data: foundUserFlats });
  } catch (error) {
    res.status(500).send({ message: "Error while getting data. Please refresh the page" });
  }
};

const addFlat = async (req, res) => {
  const { city, streetName, streetNumber, areaSize, hasAC, yearBuilt, rentPrice, dateAvailable, description } = req.body;

  const { _id } = req.user;

  if (!_id) {
    return res.status(404).send({ message: "You need to authentificate first" });
  }

  try {
    const flat = await flatService.addFlat({
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC,
      yearBuilt,
      rentPrice,
      dateAvailable,
      description,
      photoURL: `http://localhost:4000/api/photos/${req.file.filename}`,
      ownerId: _id,
    });

    return res.status(201).send({ message: "New flat added successfully", data: flat });
  } catch (error) {
    res.status(500).send({ message: "An error has occured while registering", error: error.message });
  }
};

const updateFlat = async (req, res) => {
  const { city, streetName, streetNumber, areaSize, hasAC, yearBuilt, rentPrice, dateAvailable, description } = req.body;
  const { id } = req.params;
  const { isAdmin, _id: userId } = req.user;
  const photoFile = req.file?.filename;
  console.log("photo", photoFile);
  try {
    const flat = await flatService.getFlatById(id);
    const ownerId = flat.ownerId._id.toString();

    const newData = {
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC,
      yearBuilt,
      rentPrice,
      dateAvailable,
      description,
    };
    console.log(flat.photoURL);

    if (req.file?.filename) {
      const currentPhotoName = flat.photoURL.split("/").at(-1);
      console.log("currentPhoto", currentPhotoName);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const folderPath = path.join(__dirname, "../utils/flatPhotos");
      const filePath = path.join(__dirname, "../utils/flatPhotos/" + currentPhotoName);
      console.log("path", filePath);
      const files = fs.readdirSync(folderPath);
      console.log("files", files);
      const fileExist = files.find((item) => item === currentPhotoName);
      console.log("exists", fileExist);

      if (fileExist !== undefined) {
        fs.unlinkSync(filePath);
      }
      newData.photoURL = `http://localhost:4000/api/photos/${photoFile}`;
    }
    console.log("newData", newData);
    if (!id) {
      return res.status(404).send({ message: "No flat found" });
    }

    if (userId === ownerId || isAdmin === true) {
      const updatedFlat = await flatService.updateFlat(id, newData);
      console.log("flat", updatedFlat);
      res.status(200).send({ message: "Flat has been updated", data: updatedFlat });
    } else {
      return res.status(403).send({ message: "You are not authorized to delete this flat." });
    }
  } catch (error) {
    res.status(500).send({ message: "An error has occured while updating", error: error.message });
  }
};

const deleteFlat = async (req, res) => {
  const { id } = req.params;

  const { isAdmin, _id: userId } = req.user;
  try {
    const flat = await flatService.getFlatById(id);
    const ownerId = flat.ownerId._id.toString();

    if (!id) {
      return res.status(404).send({ message: "No flat found" });
    }
    if (userId === ownerId || isAdmin == true) {
      await flatService.deleteFlat(id);
      return res.status(200).send({ message: "Flat successfully deleted" });
    } else {
      return res.status(403).send({ message: "You are not authorized to delete this flat." });
    }
  } catch (error) {
    return res.status(500).send({ message: "An error has occured while deleting", error: error.message });
  }
};

export default { getAllFlats, getFlatbyId, addFlat, updateFlat, getUserFlats, deleteFlat };
