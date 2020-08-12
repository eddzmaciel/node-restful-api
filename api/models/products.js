const mongoose = require('mongoose');

//creating the schema
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //mongoose.Types.ObjectId,
    name: String,
    price: Number,
});

//using ModelName
module.exports = mongoose.model('Product', productSchema);