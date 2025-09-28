const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // 👈 ObjectId reference
        ref: "Product",                       // 👈 link with Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
