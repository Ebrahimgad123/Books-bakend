const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      minlength: 3,
      maxlength: 200,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 200,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 200,
      trim: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

function validateNewUser(obj) {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(200).trim().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(200).trim().required(),
    confirmPassword: Joi.string()
      .min(6)
      .max(200)
      .trim()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "any.only": "Passwords do not match",
      }),
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(obj);
}
function changePasswordComplexity(obj) {
  const schema = Joi.object({
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}
function validateUpdateUser(obj) {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(200).trim(),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(200).trim(),
    confirmPassword: Joi.string()
      .min(6)
      .max(200)
      .trim()
      .valid(Joi.ref("password"))
      .messages({
        "any.only": "Passwords do not match",
      })
      .when("password", {
        is: Joi.exist(),
        then: Joi.required(),
      }),
  });

  return schema.validate(obj);
}
module.exports = {
  User,
  validateNewUser,
  validateUpdateUser,
  validateLoginUser,
  changePasswordComplexity,
};
