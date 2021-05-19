const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: [true, "please enter the product quantity"],
        default: 1
    }
});
module.exports = mongoose.model("OrderItem", orderItemSchema);