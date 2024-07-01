const mongoose = require('mongoose');
const Joi = require("joi");

// تعريف مخطط الكتاب
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  }, 
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Authors"
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  }, 
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  cover: {
    type: String,
    required: true,
    enum: ['Soft cover', 'Hard cover']
  }
}, {
  timestamps: true
});

// إنشاء نموذج الكتب
const Books = mongoose.model("Books", BookSchema);

// وظيفة التحقق من صحة بيانات الكتاب
function validateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    author: Joi.string().required(),
    description: Joi.string().trim().min(3).max(500).required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().valid('Soft cover', 'Hard cover').required()
  });
  return schema.validate(obj);
}

// وظيفة التحقق من صحة بيانات تحديث الكتاب
function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    author: Joi.string(),
    description: Joi.string().trim().min(3).max(500),
    price: Joi.number().min(0),
    cover: Joi.string().valid('Soft cover', 'Hard cover')
  });
  return schema.validate(obj);
}

// تصدير النموذج ووظائف التحقق
module.exports = { Books, validateBook, validateUpdateBook };
