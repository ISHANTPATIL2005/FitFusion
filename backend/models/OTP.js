const mongoose=require("mongoose")

const OTPSchema =new mongoose.Schema({
    email:{
        type:String,
        required:true

    },
    otp:{
        type:String,
        required:true

    },
    createdAt:{
        type:Date,
        default:Date.now(),
       expires:5*60
    }
})

async function sendverificationcode(email,otp){
    try{
        const mailresponce= await mailSender(email,'verification code from your dream',otp);
        console.log("otp send")
    }
    catch(error){
        console.error(error.massage);     
    }

  OTPSchema.pre=async(next)=>{
    await sendverificationcode(this.email,this.otp);
    next()
  }
}
module.exports=mongoose.model("OTP",OTPSchema)