const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    images: [String],
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: Number,
    isFeatured: Boolean,
    dataCreated: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Product', productSchema);