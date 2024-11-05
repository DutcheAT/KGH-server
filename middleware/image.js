const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      next();
    } else {
      const fileExtension = req.file.originalname
        .split(".")
        .pop()
        .toLowerCase();

      // Check if the file format is supported
      const supportedFormats = [
        "jpg",
        "jpeg",
        "png",
        "bnp",
        "jfif",
        "tiff",
        "svg",
        "webp",
      ];
      if (!supportedFormats.includes(fileExtension)) {
        return res.status(400).json({ message: "Unsupported file format" });
      }

      // Generate an image ID using the file name
      const imageId = req.file.filename;

      console.log("Image ID:", imageId);
      req.body.image = imageId;
      console.log("req Image ID:", req.body.image);
      next();
    }
  } catch (error) {
    console.log("Error details:", error);
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

module.exports = uploadImage;
