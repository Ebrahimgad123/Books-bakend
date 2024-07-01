const mongoose = require("mongoose");
const Joi = require("joi");
const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    }, 
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    nationality: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },  
    image: {
        type: String,
        default: 'default-avatar.png',
    },
}, {
    timestamps: true
});

const Authors = mongoose.model("Authors", AuthorSchema);

// Validate author
function validateAuthor(obj) {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(3).max(200).required(),
      lastName: Joi.string().trim().min(3).max(200).required(),
      nationality: Joi.string().trim().min(3).max(200).required(),
      image: Joi.string().trim().min(3).max(200).default('default-avatar.png')
    });
    return schema.validate(obj);
  }
  
  function validateUpdateAuthor(obj) {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(3).max(200),
      lastName: Joi.string().trim().min(3).max(200),
      nationality: Joi.string().trim().min(3).max(200),
      image: Joi.string().trim().min(3).max(200)
    });
    return schema.validate(obj);
  }
  
module.exports = {Authors,validateAuthor,validateUpdateAuthor};
