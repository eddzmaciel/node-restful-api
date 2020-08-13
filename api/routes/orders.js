const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');

// handle incoming GET request to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });

    order.save()
        .then(result => {
            console.log('result: ', result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log('err: ', err);
            res.status(500).json({ error: err })
        });

});


router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'order details',
        orderId: req.params.orderId
    });
});


router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'order deleted',
        orderId: req.params.orderId
    });
});


module.exports = router;