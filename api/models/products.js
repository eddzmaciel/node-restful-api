const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
//creating the schema
const productSchema = mongoose.Schema({
    //adding param validation
    _id: ObjectId, //mongoose.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true }
});

//using ModelName
module.exports = mongoose.model('Product', productSchema);