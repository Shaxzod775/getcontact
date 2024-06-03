const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = (url) => {
    mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error occured while connecting to MongoDB ', error)
    })
}


module.exports = connectDB;


