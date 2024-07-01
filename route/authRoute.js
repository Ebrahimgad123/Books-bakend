const { Router } = require('express');
const { User, validateNewUser, validateUpdateUser ,validateLoginUser} = require('../model/User');
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const JWT_SECRET = process.env.JWT_SECRET || ".sZz=x9OfY`2o4X";

router.post('/users/register', asyncHandler(async (req, res) => {
  const newUser = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
  };

  if (req.body.isAdmin) {
      return res.status(403).json({ error: "You are not allowed to update {isAdmin}" });
  }

  // التحقق من صحة البيانات المدخلة
  const { error } = validateNewUser(newUser);
  if (error) {
      return res.status(400).json({ error: error.details[0].message });
  }

  // التحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل
  const existingUser = await User.findOne({ email: newUser.email });
  if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  // إنشاء مستخدم جديد مع ضبط خاصية isAdmin إلى false
  const user = new User({
      userName: newUser.userName,
      email: newUser.email,
      password: hashedPassword,
      isAdmin: false
  });

  const result = await user.save();

  // إنشاء التوكن
  const token = jwt.sign(
      { _id: result._id, isAdmin: result.isAdmin },
      JWT_SECRET // ضبط مدة صلاحية التوكن حسب الحاجة
  );

  // إنشاء استجابة البيانات
  const responseData = {
      _id: result._id,
      userName: result.userName,
      email: result.email,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      token: token 
  };

  // إرسال الاستجابة
  res.status(201).json(responseData);
}));

// Login user
router.post('/users/login', asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate token
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        JWT_SECRET
      );

      const temp = {
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
        token: token,
        message: "you login successfully"
      };

      res.status(200).json(temp);
    } else {
      res.status(401).json({ message: 'invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}));

module.exports = router;

