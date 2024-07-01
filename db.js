const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.error('خطأ في الاتصال بقاعدة البيانات MongoDB:', error);
    });

module.exports = mongoose;


