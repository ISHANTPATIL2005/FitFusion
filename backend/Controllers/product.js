require("dotenv").config
const User = require("../models/User")
const Product = require("../models/Product")
const productCategory = require("../models/productCategory")
const { populate } = require("dotenv")
const { uploadImageToCloudinary } = require("../utils/imageUplodaer")

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, brand, category, countInStock } = req.body;

        if (!name || !price || !description || !brand || !category || !countInStock) {
            return res.status(400).json({ success: false, message: "Fill all details" });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, message: "Image not received" });
        }
        const image = req.files.image;

        const userId = req.user.id;
        const isUser = await User.findById(userId);
        if (!isUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const productImage = await uploadImageToCloudinary(image, process.env.FOLDER_IMAGE);

        const newProduct = await Product.create({
            name,
            price,
            description,
            brand,
            category,
            countInStock,
            image: productImage.secure_url,
            user: userId
        });

        await User.findByIdAndUpdate(userId, { $push: { product: newProduct._id } });

        return res.status(200).json({ success: true, message: "Product created successfully" });

    } catch (error) {
        console.error("Create product error:", error);
        return res.status(500).json({
            success: false,
            message: "Error in createProduct",
            error: error.message
        });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { ProductId, name, description, price, brand, category, countInStock } = req.body;
        if (!ProductId || !name || !price || !description || !brand || !category || !countInStock) {
            return res.status(400).json({ success: false, message: "Fill all details" })
        }
        const updateParoduct = await Product.findByIdAndUpdate(ProductId,
            {
                name,
                description,
                price,
                brand,
                category,
                countInStock
            },
            { new: true })

        if (!updateParoduct) {
            return res.status(404).json({
                success: false,
                message: "Product not updated"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Product Updatedd Successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in UpdatePrduct"
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { ProductId } = req.body;

        if (!ProductId) {
            return res.status(404).json({
                success: false,
                message: "User Id not get"
            })
        }
        await Product.findByIdAndDelete(ProductId);
        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in User Delete"
        })
    }
}

exports.getprodact = async (req, res) => {
    try {
        const pageSize = 10;
        const page = req.query.pageNumber || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: [i],
                },
            } : {};

        const count = await Product.countDocuments({ ...keyword });

      
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        
        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getAllProduct=async(req,res)=>{
    try{
        const allproduct=await Product.find({})
       .select("name image category brand description countInStock price");
 return res.status(200).json({
                    success:true,
                    message:"all product",
                    allproduct
                })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

exports.getProductById=async(req,res)=>{
try{
     const { ProductId } = req.params;
const product=await Product.findById(ProductId)
 console.log("Received ID:", ProductId);
if(!product){
    return res.status(400).json({
        success:false,
        message:"Don't get product"
    })
}
return res.status(200).json({
    success:true,
    message:"find Product successfully",
    product})
}
catch(error){
    return res.status(500).json({
        success:false,
        message:"Error in getProduct By Id",
        error:error.message
    })
}

}