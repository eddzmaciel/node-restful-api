//
const express = require('express');
const app = express();
//it show activity logs on your console
const morgan = require('morgan');

//parse the body of incoming request, give a nicely format
//doesn´t support files, but support url encoded, bodys, json data
const bodyParser = require('body-parser');
//connection to db
const mongoose = require('mongoose');



// mongoose.connect('mongo "mongodb+srv://node-rest-eddzmaciel.v241b.mongodb.net/' + process.env.DATABASE_NAME + '" --username eddzmaciel',

// );

mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@node-rest-eddzmaciel.v241b.mongodb.net/`,
    {
        dbName: process.env.DB_NAME,
        useUnifiedTopology: true,
        useNewUrlParser: true
    });


//import routes 
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

//implementing morgan in the app
app.use(morgan('dev'));

//integrate con the incoming request
//extract the url encoded and json data and it is easy to read it
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//CORS .- Cross Origin Resource Sharing, secured mecanism enforce by the browser
//
//adding header to our request
//ensures that we prevent CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "origin, X-Requested-With, Content-type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});



//ROUTES
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

//handling errors
app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    //will forward this error request
    next(error);
});

//this will handle all kinds of errors like db errors 
app.use((error, req, res, next) => {
    //here you pass the error status or 500 by default 
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status,
            message: error.message
        }
    });
});


//
module.exports = app;



