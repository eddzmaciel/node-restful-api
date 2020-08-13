const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

//creating the schema
const orderSchema = mongoose.Schema({
    //adding param validation
    _id: ObjectId, //mongoose.Types.ObjectId,
    product: { type: ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }

});

//using ModelName
module.exports = mongoose.model('Order', orderSchema); 