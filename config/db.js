const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('Error: MONGO_URI is not defined in the environment file.');
    process.exit(1); // Exit the process if MONGO_URI is not defined
}

function connectToMongoDB() {
    mongoose.connect(uri).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
}

connectToMongoDB();

module.exports = mongoose;