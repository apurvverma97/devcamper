const path = require('path');
const express = require('express');
const dotenv = require('dotenv'); 
const logger = require('./middlewares/logger');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error')


// import js having routes
const bootcamps = require('./routes/bootcamps');
const courses   = require('./routes/courses');
const auth = require('./routes/auth');

// loading environment variables
dotenv.config({path : './config/config.env'});

// initialising express application
const app = express();

// body parser
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname,'public')));

// file upload middleware
app.use(fileupload());

// mounting logger
app.use(morgan('dev'));

// establishing mongoDb connection
connectDB();

// mounting routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

// mounting erorr handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    })
})