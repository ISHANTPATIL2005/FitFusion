const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Address =require("../models/adders");

exports.placeorder = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Find user cart
    const cart = await Cart.findOne({ email });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 3. Get address for this user
    const address = await Address.findOne({ user: user._id });
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "No shipping address found. Please add address first.",
      });
    }

    // 4. Convert cart items -> order items
    // 4. Convert cart items -> order items
const orderItems = cart.items.map((cartItem) => ({
  ProductId: cartItem.productId,
  quantity: cartItem.quantity,
  PaymentMode: "Cash On Delivery",
  date: new Date().toISOString(),
}));

// 5. Save order
const newOrder = new Order({
  email,
  item: orderItems,
  shippingAddress: {
    street: address.street,
    city: address.city,
    postalCode: address.postalCode,
    country: address.country,
  },
});
await newOrder.save();


    // 6. Clear cart
    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder, });
    }
 catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in place order",
      error: error.message,
    });
  }
};



exports.getorder = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const orders = await Order.find({ email });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getOrder",
      error: error.message,
    });
  }
};
