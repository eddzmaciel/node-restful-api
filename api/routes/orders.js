const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//import the middleware for token validation
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/orders');
const Product = require('../models/products');



// handle incoming GET request to /orders
router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        //populate the order information with the products
        //you can put the list of properties that you want to fetch
        .populate('product', 'name')
        .exec()
        .then(result => {
            //we are giving more structure for the response
            res.status(200).json({
                count: result.length,
                orders: result.map(item => {
                    return {
                        _id: item._id,
                        product: item.product,
                        quantity: item.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + item._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', checkAuth, (req, res, next) => {
    //be sure to create orders with products that we dont have
    Product.findById(req.body.productId)
        .then(product => {
            //here we execute the other code to create the new order with the existing product
            //we need to check if we have the product
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Order Created Successfully',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log('err: ', err);
            res.status(500).json(
                {
                    message: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
                    error: err
                })
        });
});

//find order by Id
router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('quantity product _id')
        //populate the order information with the products
        .populate('product')
        .exec()
        .then(order => {
            //if order is not found
            if (!order) {
                res.status(404).json({
                    message: "order not found"
                });
            }
            res.status(200).json({
                order: {
                    _id: order._id, quantity: order.quantity, product: order.product
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            console.log('err:', err);
            res.status(500).json({
                error: err
            })
        });
});


router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({
        _id: req.params.orderId
    })
        .exec()
        // if we delete the order we can show an example how to create a new one
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: {
                        productId: "ID", quantity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            console.log('err:', err);
            res.status(500).json({
                error: err
            })
        });
});


module.exports = router;


