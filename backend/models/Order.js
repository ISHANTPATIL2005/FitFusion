const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    item: [
        {
            ProductId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number, required: true
            },
            PaymentMode: {
                type: String,
                default: "Cash On Delivery"
            },
            date: {
                type: Date,
                default: Date.now
            },
        },
    ],
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    },
});


module.exports = mongoose.model("Order", orderSchema)