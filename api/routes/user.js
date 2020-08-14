const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use this for encrypt our user password
const bcrypt = require('bcrypt');

const User = require('../models/users');

// we need to hash our password 
router.post('/signup', (req, res, next) => {
    //first verify if the email exists
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            //because we are getting a null, so it will pass the validation
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "this email already exists"
                });
            } else {

                //salting rounds for random characters
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        //if we create the hash password, then we proceed to create the user
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log('result: ', result);
                                res.status(201).json({
                                    message: 'user created'
                                });
                            })
                            .catch(err => {
                                console.log('err:', err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });

            }
        })
        .catch();
});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/users/signup",
                    body: {
                        email: "String", password: "String"
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


