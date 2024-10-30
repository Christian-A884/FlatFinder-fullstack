import Flat from "../models/flatModel.js";

const getFlatById = async (_id) => {
  try {
    return await Flat.findById(_id).populate({ path: "ownerId", select: "firstName lastName email" });
  } catch (error) {
    throw error;
  }
};

const getUserFlats = async (_id) => {
  try {
    return await Flat.find({ ownerId: _id }).populate({ path: "ownerId", select: "firstName lastName email" });
  } catch (error) {
    throw error;
  }
};

const getAllFlats = async () => {
  try {
    return await Flat.find().populate({ path: "ownerId", select: "firstName lastName email" });
  } catch (error) {
    throw error;
  }
};

const addFlat = async (flat) => {
  try {
    return await Flat.create(flat);
  } catch (error) {
    throw error;
  }
};

const updateFlat = async (idOfFlatToUpdate, newData) => {
  try {
    await Flat.updateOne(
      { _id: idOfFlatToUpdate },
      {
        $set: {
          city: newData.city,
          streetName: newData.streetName,
          streetNumber: newData.streetNumber,
          areaSize: newData.areaSize,
          hasAc: newData.hasAc,
          yearBuilt: newData.yearBuilt,
          rentPrice: newData.rentPrice,
          dateAvailable: newData.dateAvailable,
          description: newData.description,
          photoURL: newData.photoURL,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const deleteFlat = async (idOfFlatToDelete) => {
  try {
    await Flat.deleteOne({ _id: idOfFlatToDelete });
  } catch (error) {
    throw error;
  }
};

const deleteFlats = async (idOfFlatOwner) => {
  try {
    await Flat.deleteMany({ ownerId: idOfFlatOwner });
  } catch (error) {
    throw error;
  }
};

const photoUpload = async (flatId) => {
  try {
    await Flat.updateOne({ _id: flatId }, { $set: { photoURL: `http://localhost:4000/api/photos/${req.file.filename}` } });
  } catch (error) {
    throw error;
  }
};

export default { getAllFlats, getFlatById, addFlat, updateFlat, getUserFlats, deleteFlat, deleteFlats, photoUpload };
