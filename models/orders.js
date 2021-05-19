const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required:[true,"order have no order items"]
     }],
    shippingAdress1: {
        type: String,
        required:true
    },
    shippingAdress2: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
    },
    zip: {
        type: String,
        required:true
    },
    country: {
        type: String,
        required:true
    },
    phone: {
        type: Number,
        required:true
    },
    status: {
        type: String,
        required: true,
        default:"Pending"
    },
    totalPrice: {
        type: Number,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    dateOrdered: {
        type: Date,
        default:Date.now()
    }
});
module.exports = mongoose.model("Order", orderSchema);