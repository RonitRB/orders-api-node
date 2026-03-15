require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Orders routes
const ordersRouter = require('./routes/orders');

// Configures the database
const dbConfig = require('./api/config/mongodb.config.js');

const args = process.argv;
let database;

if (args.includes('--prod=true')) {
    database = dbConfig.urlProd;
    console.log('Using production connection string.');
} else {
    database = process.env.MONGO_URI || dbConfig.url;
    console.log('Using local connection string.');
}

//MongoDB Connection
mongoose.Promise = global.Promise;

mongoose
    .connect(database)
    .then(() => {
        console.log('Successfully connected to MongoDB.');
    })
    .catch((error) => {
        console.log('Could not connect to MongoDB. Error: ' + error);
        process.exit();
    });

//Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Request logger (production-style logging)
app.use(morgan('dev'));

//Root Route
app.get("/", (req, res) => {
    res.json({
        message: "Order Management API is running 🚀",
        endpoints: {
            health: "/health",
            users: "/api/users",
            orders: "/api/orders"
        }
    });
});

//Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        message: "API is healthy",
        timestamp: new Date()
    });
});

/*
--------------------------------------------------
API Routes
--------------------------------------------------
*/

// Existing user routes
require('./api/routes/user.routes.js')(app);

// Orders routes
app.use('/api/orders', ordersRouter);

/*
--------------------------------------------------
Start Server
--------------------------------------------------
*/
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

//404 Handler
app.use((req, res, next) => {
    next(createError(404, "This route doesn't exist"));
});

//Global Error Handler
app.use((error, req, res, next) => {
    console.error(error.message);

    if (!error.statusCode) {
        error.statusCode = 500;
    }

    res.status(error.statusCode).json({
        error: error.message
    });
});