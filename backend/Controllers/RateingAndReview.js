const reatingAndReview = require("../models/rateingAndReview")
const Product = require("../models/Product")


exports.RateingAndReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reating, review, productId } = req.body;

        if (!reating || !review || !productId) {
            return res.status(400).json({
                success: false,
                message: "Fill all Require Details"
            })
        }

        const alreadyReview = await reatingAndReview.findOne({ userId, productId })

        if (alreadyReview) {
            return res.status(400).json({
                success: false,
                message: "User Already Reviewd"
            })
        }
        const createReviewed = await reatingAndReview.create({
            reating,
            review,
            Product: productId,
            User: userId
        });
        if (!createReviewed) {
            return res.status(400).json({
                success: false,
                message: "Reating not created"
            })
        }

        const updateProduct = await Product.findByIdAndUpdate(
            productId,
            { $push: { RateingAndReview: createReviewed._id } },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: "Reating and Review created"
        })
        0
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Review Section",
            error: error.message
        })

    }
}

exports.allreating = async (req, res) => {
    try {
        const allReview = await reatingAndReview.find({})
            .sort({ reating: "desc" })
            .populate({
                 path: "User",
                 select: "firstName lastName email" })
                 
            .populate({
                 path: "Product", 
                select: "name" });


        return res.status(200).json({
            success: true,
            message: "All reating",
            allReview
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in All reating"
        });
    }
};

exports.getRatingById=async(req,res)=>{
    try{
        const {productId}=req.params;
        if(!productId){
            return res.status(400).json({
                success:false,
                message:"Product Id not found"
            })}
   const ratings = await reatingAndReview.find({ Product: productId })   
      //.sort({ rating: -1 })          
      .populate({
        path: "User",
        select: "firstName lastName email",
      })
      .populate({
        path: "Product",
        select: "name",
      });
        if(!ratings){
            return res.status(404).json({
                success:false,
                message:"Rating not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Rating Found",
            ratings
        })
    

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in getting rating by ID",
            error: error.message
        })
    }
}

exports.getRatingAndReviewById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product Id not found"
      });
    }

    const ratings = await reatingAndReview.find({ productId })
      .populate("user") // if you want user details
      .populate("productId"); // if you want product details

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Ratings Found for this Product"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ratings Found",
      ratings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting rating by ID",
      error: error.message
    });
  }
};


