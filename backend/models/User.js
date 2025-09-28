const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    AccountType: {
        type: String,
        enum: ["Admin", "Consumer"]
    },
    Product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }],
    addresses: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }
],
    image: {
        type: String
    },




})

module.exports = mongoose.model("User", userSchema)