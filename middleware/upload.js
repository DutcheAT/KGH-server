// middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/User Image");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

exports.uploadUserImage = multer({ storage: storageUser });


