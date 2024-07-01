const express = require('express');
const cors = require('cors'); 
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const Joi = require('joi');
const dbConfig=require('./db');
const { logger } = require('./middlewares/logger');
require('dotenv').config();
const { notFound, errorHandling} = require('./middlewares/errorHandler');


const app = express(); // Initialize the Express app
const port = process.env.PORT || 8000;

app.use(express.json()); 
app.use(cors());
app.use(compression());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// logger middleware
app.use(logger)
app.use('/api', require('./route/booksRoute'));
app.use('/api', require('./route/authorsRoute'));
app.use('/api', require('./route/authRoute'));
app.use('/api', require('./route/usersRoute'));
app.use(notFound)
app.use(errorHandling)

app.listen(port, () => console.log(`server is listening on port ${port} ! on ${process.env.NODE_ENV} mode`));







