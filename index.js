require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cors = require('cors');

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

// Connect to MongoDB
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

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        message: "Order Management API is running 🚀",
        endpoints: {
            users: "/api/users",
            orders: "/api/orders"
        }
    });
});

// Load existing user routes
require('./api/routes/user.routes.js')(app);

// Orders routes
app.use('/api/orders', ordersRouter);

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Server running at http://localhost:${port}`);
});

// 404 Handler
app.use((req, res, next) =>
    next(createError(404, "This route doesn't exist"))
);

// Error handler
app.use(function (error, req, res, next) {
    console.error(error.message);

    if (!error.statusCode) {
        error.statusCode = 500;
    }

    res.status(error.statusCode).json({
        error: error.message
    });
});