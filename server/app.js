const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./db/connect');
const router = require('./router/users');
const errorMiddleware = require('./middleware/error-middleware');
const morgan = require('morgan');

const PORT = process.env.port || 5000;


const app = express();

app.use(express.json());

app.use(morgan('combined'));
app.use(cors({
    credentials: true,
    origin: "http://192.168.31.243:5000"
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.DB_URL);
        app.listen(PORT, () => console.log(`Server is working on PORT ${PORT}`))
    } catch(error) {
        console.log(error)
    }
}

start();






