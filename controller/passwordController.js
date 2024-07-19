const asyncHandler = require("express-async-handler");
const { User, changePasswordComplexity } = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
/**
 * @desc    Get forgot password view
 * @route   GET /password/forgot-password
 * @access  Public
 **/
const getForgotPasswordView = asyncHandler(async (req, res) => {
  res.render("forgot-password");
});

/**
 * @desc    Send forgot password link
 * @route   POST /password/forgot-password
 * @access  Public
 **/
const sendForgotPasswordLink = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user); // تحقق من وجود المستخدم في قاعدة البيانات
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const secret = process.env.JWT_SECRET + user.password;
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
    },
    secret,
    { expiresIn: "40m" },
  );

  const link = `http://localhost:3000/password/reset-password/${user._id}/${token}`;
  // res.json({ message: "Click on the link to reset your password", resetPasswordLink: link });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // بريدك الإلكتروني
      pass: process.env.EMAIL_PASS, // كلمة المرور أو رمز التطبيق الخاص ببريدك الإلكتروني
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    html: `
            <p>Hi ${user.userName},</p>
            <p>We received a request to reset your password. Click the link below to reset your password:</p>
            <a href="${link}">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,</p>
            <p>Your Company Name</p>
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);
      res.render("check-email");
    }
  });
});

/**
 * @desc    Get reset password view in email
 * @route   GET /password/reset-password/:userId/:token
 * @access  Public
 **/
const GetResetPasswordView = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    jwt.verify(req.params.token, secret);

    res.render("reset-password", {
      userId: req.params.userId,
      token: req.params.token,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Invalid or expired token" });
  }
});

/**
 * @desc    Reset password
 * @route   POST /password/reset-password/:userId/:token
 * @access  Public
 **/
const ResetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { error } = changePasswordComplexity({ password });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    jwt.verify(req.params.token, secret);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.render("success-password");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = {
  getForgotPasswordView,
  sendForgotPasswordLink,
  GetResetPasswordView,
  ResetPassword,
};
