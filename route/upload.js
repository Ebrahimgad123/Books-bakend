// uploadRouter.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storage });

// api /upload
router.post("/upload", upload.single("image"), (req, res) => {
  const imageUrl = `http://127.0.0.1:3000/images/${req.file.filename}`;

  res.status(200).json({ message: "Image uploaded", imageUrl: imageUrl });
});
// get view upload
router.get("/upload", (req, res) => {
  res.render("upload-image");
});
module.exports = router;
