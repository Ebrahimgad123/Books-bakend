const { Router } = require("express");
const router = Router();
const { verifyTokensAndAdmin } = require("../middlewares/verfiyToken");
const {
  getAllAuthors,
  getAuthorById,
  deleteAuthorByID,
  createNewAuthor,
  updateAuthor,
} = require("../controller/authorController");

router.get("/authors", getAllAuthors);
router.get("/authors/:id", getAuthorById);
router.delete("/authors/:id", verifyTokensAndAdmin, deleteAuthorByID);
router.post("/authors", verifyTokensAndAdmin, createNewAuthor);
router.put("/authors/:id", verifyTokensAndAdmin, updateAuthor);

module.exports = router;
