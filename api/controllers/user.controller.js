const mongoose = require('mongoose');
//use this for encrypt our user password
const bcrypt = require('bcrypt');
//this is for generate our tokens
const jwt = require('jsonwebtoken');
const User = require('../models/users');


exports.user_signup = (req, res, next) => {
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
                //here we will hash the password and afeter we will create the record
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
        .catch(err => {
            console.log('err:', err);
            res.status(500).json({
                error: err
            })
        });
};

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            //comparing the password
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                //this comparation will return true or false
                if (result) {
                    //here we call the jwt
                    //we will convert the values to encoded
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                        //you have to use some complex JWT_KEY
                    }, process.env.JWT_KEY,
                        //here we are going to define the login options
                        {
                            expiresIn: "1h",
                        }
                    );
                    //if is true will return this
                    return res.status(200).json({
                        message: 'Auth Successfull',
                        token: token
                    });
                }
                //if is false will return this
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log('err:', err);
            res.status(500).json({
                error: err
            })
        });
};

exports.user_delete = (req, res, next) => {
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
};