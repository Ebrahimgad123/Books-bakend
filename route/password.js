const { Router } = require("express");
const {
  getForgotPasswordView,
  sendForgotPasswordLink,
  GetResetPasswordView,
  ResetPassword,
} = require("../controller/passwordController");
const router = Router();

// /password/forgot-password
router.get("/forgot-password", getForgotPasswordView);
router.post("/forgot-password", sendForgotPasswordLink);
router.get("/reset-password/:userId/:token", GetResetPasswordView);
router.post("/reset-password/:userId/:token", ResetPassword);

module.exports = router;
