const { Router } = require("express");
const router = Router();
const {
  getAllBooks,
  getBookById,
  deleteBookByID,
  createNewBook,
  updateBook,
  UploadBooks,
} = require("../controller/bookController");
const { verifyTokensAndAdmin } = require("../middlewares/verfiyToken");
const multer = require("multer");
const path = require("path");

///////////////////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storage });
////////////////////////////////
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);
router.delete("/books/:id", verifyTokensAndAdmin, deleteBookByID);
router.post("/books", verifyTokensAndAdmin, createNewBook);
router.post("/uploadBooks", upload.single("image"), UploadBooks);
/**
 * @desc  upload book view
 * @route /api/uploadBooks
 * @method Put
 * @access private (only admin can update)
 **/
router.get("/uploadBooks", (req, res) => {
  res.render("upload-book");
});

router.put("/books/:id", verifyTokensAndAdmin, updateBook);

module.exports = router;
