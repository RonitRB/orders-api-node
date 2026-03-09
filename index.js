require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cors = require('cors');

const app = express();

// Orders routes (added)
const ordersRouter = require('./routes/orders');

// Configures the database
const dbConfig = require('./api/config/mongodb.config.js');

const args = process.argv;
let database;

if (args.includes('--prod=true')) {
    database = dbConfig.urlProd;
    console.log('Using production connection string.');
} else {
    // allow override using MONGO_URI env var if provided
    database = process.env.MONGO_URI || dbConfig.url;
    console.log('Using local connection string.');
}

// Connects to the database
mongoose.Promise = global.Promise;
mongoose
    .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('Successfully connected to MongoDB.');
    })
    .catch((error) => {
        console.log('Could not connect to MongoDB. Error: ' + error);
        process.exit();
    });

// Body parsing middlewares
app.use(express.json()); // modern built-in parser
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);
app.use(cors());

// Load routes (existing user routes)
require('./api/routes/user.routes.js')(app);

// Mount orders route
app.use('/api/orders', ordersRouter);

// Creates server (use PORT from env if provided)
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

// 404 Handler
app.use((request, response, next) => next(createError(404, "This route don't exist.", { expose: false })));

// Error handler
app.use(function (error, request, response, next) {
    console.error(error.message);
    if (!error.statusCode) error.statusCode = 500;
    response.status(error.statusCode).send(error.message);
});