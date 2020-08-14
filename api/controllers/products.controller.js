const mongoose = require('mongoose');
const Product = require('../models/products');

//controller to retriev all the elements
exports.products_get_all = (req, res, next) => {
    Product.find()
        //controlling which one fields you want to get
        .select('name price _id productImage')
        .exec()
        .then(result => {
            //giving structure to the response object
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        //url example http://localhost:3000/uploads/2020-08-13T23:05:59.766ZScreen%20Shot%202020-07-31%20at%2011.41.50%20AM.png
                        productImage: doc.productImage,
                        //creating the request for the created element
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            //is not an error when you get an empty array, 
            //but you also can handle this kind of response
            // if (result.length >= 0) {
            res.status(200).json(response);
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
};

//controller to create one element
exports.products_create_product = (req, res, next) => {
    console.log('productImage: ', req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    //will storage the values in the database
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Product Created Successfully ',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    //request for the created object 
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log('err: ', err);
            res.status(500).json({ error: err });
        });
};
//controller to get one element by id
exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(result => {
            //we will throw an response 
            if (result) {
                res.status(200).json({
                    product: result,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
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
};

//controller to update one element by id
exports.products_update_product = (req, res, next) => {
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
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

//controller for delete one element by id
exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};