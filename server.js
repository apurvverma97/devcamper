const express = require('express');
const dotenv = require('dotenv'); 
const logger = require('./middlewares/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error')

// import js having routes
const bootcamps = require('./routes/bootcamps');

// loading environment variables
dotenv.config({path : './config/config.env'});

// initialising express application
const app = express();

// body parser
app.use(express.json());

// establishing mongoDb connection
connectDB();

// mounting logger
app.use(morgan('dev'));

// mounting routes
app.use('/api/v1/bootcamps', bootcamps);

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