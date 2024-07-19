const { Router } = require("express");
const router = Router();
const {
  verifyTokensAndAuthorization,
  verifyTokensAndAdmin,
} = require("../middlewares/verfiyToken");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controller/userController");

router.get("/users", verifyTokensAndAdmin, getAllUsers);
router.get("/users/:id", verifyTokensAndAuthorization, getUserById);
router.delete("/users/:id", verifyTokensAndAuthorization, deleteUser);
router.put("/users/:id", verifyTokensAndAuthorization, updateUser);

module.exports = router;
