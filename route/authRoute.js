const { Router } = require("express");
const {
  registerNewUser,
  loginNewUser,
} = require("../controller/authController");
const router = Router();

router.post("/register", registerNewUser);
router.post("/login", loginNewUser);

module.exports = router;
