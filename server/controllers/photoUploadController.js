import flatService from "../services/flatService.js";

const uploadPhoto = async (req, res) => {
  const { _id } = req.params;
  const flat = await flatService.getFlatById(_id);

  if (!flat) {
    return res.status(404).send({ message: `No flat found with id ${_id}` });
  }

  try {
    await flatService.photoUpload(_id);
    res.status(200).send({ message: "Photo uploaded" });
  } catch (error) {
    res.status(500).send({ message: "An error occured while uploading photo." });
  }
};

export default { uploadPhoto };
