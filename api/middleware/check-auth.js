
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //try to get my token from the header
        //split to remove the Bearer term
        const token = req.headers.authorization.split(" ")[1];
        console.log('--->token:', token);
        //valid if is base 64code
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log('--->decoded:', decoded);
        req.userData = decoded;
        //we call it if we success authenticated
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }

};