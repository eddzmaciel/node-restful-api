//
const express = require('express');
const app = express();
//it show activity logs on your console
const morgan = require('morgan');
//import routes 
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

//implementing morgan in the app
app.use(morgan('dev'));

//doing the routes redirection to handle request
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