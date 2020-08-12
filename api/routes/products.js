const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

//incoming get request
router.get('/', (req, res, next) => {
    Product.find().exec()
        .then(result => {
            console.log(result);
            //is not an error when you get an empty array, 
            //but you also can handle this kind of response

            // if (result.length >= 0) {
            res.status(200).json(result);
            // } else {
            //     res.status(400).json({
            //         message: 'no entries found'
            //     });
            // }
        })
        .catch(err => {
            console.log('err: ', err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    //will storage the values in the database
    product.save()
        .then(result => {
            console.log('--> result from database: ', result);
            res.status(201).json({
                message: 'handling POST request to /products - created successfully ',
                data: result
            });
        })
        .catch(err => {
            console.log('err: ', err);
            res.status(500).json({ error: err });
        });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then(result => {
            console.log('--> result from database: ', result);
            //we will throw an response 
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log('err: ', err);
            //and we will throw an error response if something fail
            res.status(500).json({ error: err });
        });

});


router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    //we will pass the p
    const updatedOps = {};
    for (const ops of req.body) {
        updatedOps[ops.propName] = ops.value;
    }

    console.log('updatedOps:', updatedOps)
    Product.update({ _id: id }, { $set: updatedOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result)

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

//delete object by objectId
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;