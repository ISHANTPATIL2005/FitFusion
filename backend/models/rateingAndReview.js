const mongoose =require("mongoose")

const reatingSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    reating:{
        type:String
    },
    review:{
        type:String
    }

})
module.exports=mongoose.model("reatingAndReview",reatingSchema)