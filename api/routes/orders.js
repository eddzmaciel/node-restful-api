const express = require('express');
const router = express.Router();
//import the middleware for token validation
const checkAuth = require('../middleware/check-auth');
//importing the  controllers
const OrdersController = require('../controllers/orders.controller');


// get all the order records
router.get('/', checkAuth, OrdersController.orders_get_all);

//create a new order
router.post('/', checkAuth, OrdersController.orders_create_order);

//get an  order by Id
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//delete an order
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);


module.exports = router;


