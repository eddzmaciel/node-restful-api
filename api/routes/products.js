const express = require('express');
const router = express.Router();
//able to handle body parser as formData
const multer = require('multer');
//import the middleware for token validation
const checkAuth = require('../middleware/check-auth');
//import controller
const ProductsController = require('../controllers/products.controller');


//CONFIGURATIONS
//where and what kind of files to storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //execute the callback
        //location to save the file
        cb(null, './uploads/');
    },
    //generating the filename
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
//add filter for the files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        //accept the file
        cb(null, true);
    }
    else {
        //reject the file
        cb(null, false);
    }
}
// file configuration
const upload = multer(
    {
        storage: storage,
        //limit the filesize
        limits: {
            filesize: 1024 * 1024 * 5
        },
        //adding filter filter
        fileFilter: fileFilter
    }
);


//####### ROUTE LIST
//incoming get request
router.get('/', ProductsController.products_get_all);

//1. you can pass as many handlers as you want here
//2. each handler is a middleware that executes before the next one runs
//3. upload.single('productImage') send as a form-data
//4. I have added "checkAuth" to validate the auth user token, it will execute first

//create a new product
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

//get product by id
router.get('/:productId', ProductsController.products_get_product);

//update an product by id
router.patch('/:productId', checkAuth, ProductsController.products_update_product);

//delete a product
router.delete('/:productId', checkAuth, ProductsController.products_delete);


module.exports = router;