const Product=require("../models/Product")
const Cart = require("../models/Cart");

exports.createCart=async(req,res)=>{

  try{  const {email}=req.body;
    if(!email){
        return res.status(400).json({
            success:false,
            message:"fill all details"
        })
    }
   const cart = new Cart({ email, items: [] });
await cart.save();
    if(!cart){
        return res.status(404).json({
            success:false,message:"cart not created"
        })
    }
    return res.status(200).json({
        success:true,
        message:"Cart Createdd"
    })

}
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in Cart Created"
            ,error:error.message
        })
    }
}

exports.addToProduct = async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    if (!email || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Fill all details"
      });
    }

    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if product is already in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    console.log("Product added to cart:", cart);

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding product to cart",
      error: error.message
    });
  }
};


exports.updateCart = async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    if (!email || !productId || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "Fill all details"
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // Find the product in the cart
    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item) {
      // Update quantity
      item.quantity = quantity;
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message
    });
  }
};

exports.initializeCart = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }


    let cart = await Cart.findOne({ email });

    if (!cart) {
      cart = await Cart.create({
        email,
        items: []
      });

      return res.status(201).json({
        success: true,
        message: "Cart initialized",
        cart
      });
    }

    // If cart already exists, just return it
    return res.status(200).json({
      success: true,
      message: "Cart already exists",
      cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error initializing cart",
      error: error.message
    });
  }
};



exports.getCart = async (req, res) => {
  try {
    const { email } = req.query;

    const cart = await Cart.findOne({ email })
      .populate({
        path: "items.productId", 
        select: "name price image brand description", 
      });

    if (!cart) {
      return res.status(200).json({ cart: { items: [] } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { email, productId } = req.body;

    if (!email || !productId) {
      return res.status(400).json({
        success: false,
        message: "Email and Product ID required"
      });
    }

    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error removing item",
      error: error.message
    });
  }
};
