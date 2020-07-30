//
const express = require('express');

const app = express();
//import routes

const productRoutes = require('./api/routes/products');

app.use('/products', productRoutes);

//work as a middleware
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'it works'
//     });
// });


//
module.exports = app;