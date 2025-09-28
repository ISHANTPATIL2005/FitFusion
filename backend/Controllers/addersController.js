const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Address = require("../models/adders");

exports.setAddress = async (req, res) => {
  try {
    const { street, city, postalCode, country } = req.body;
    const email = req.user.email;

    if (!street || !city || !postalCode || !country) {
      return res.status(400).json({ success: false, message: "Fill all details" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = await Address.create({
      user: user._id,
      street,
      city,
      postalCode,
      country
    });

    user.addresses.push(address._id);
    await user.save();

    return res.status(200).json({ success: true,
       message: "Address saved", address });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error in setting address", error: error.message });
  }
};

exports.getAddress = async (req, res) => {
  try {
   // get user first
   const {email}=req.query;
const user = await User.findOne({ email }).populate("addresses"); 
if (!user) {
  return res.status(404).json({ success: false, message: "User not found" });
}

// get address by user reference
const address = await Address.findOne({ user: user._id });
if (!address) {
  return res.status(400).json({
    success: false,
    message: "No shipping address found. Please add address first.",
  });
}


    return res.status(200).json({ 
      success: true,
       addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({
       success: false, 
       message: "Error in getting address", 
       error: error.message });
  }
};
