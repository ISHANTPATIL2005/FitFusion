const mongoose=require("mongoose")



const productCatogorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        },
       product: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  }
]


   } )

module.exports=mongoose.model("productCategory",productCatogorySchema)