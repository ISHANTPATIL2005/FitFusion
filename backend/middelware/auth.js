const User =require("../models/User")
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.auth =(req,res,next)=>{
    const token=req.cookies.token|| req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        return res.status(400).json({
            success:false,
            message:"token not get in auth middelwaire"
        })}
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decode;
            console.log(decode,req.user);
            next()
            
        }
        catch(error){
            return res.status(500).json({success:false,message:"error in auth middelware"})
        }
    
}

exports.IsConsumer=(req,res,next)=>{
    try{
        if(req.user.AccountType !="Consumer"){
            return res.status(400).json({ success:false,message:"Account type not match"})
        }
        next()
    }
    catch(error){
        return res.status(500).jasn({
            success:false,
            message:"Error in middelware IsConsumer"
        })
    }
}
exports.Admin=(req,res,next)=>{
    try{
        if(req,user.AccountType!="Admin"){
            return res.status(500).json({
                success:400,
                message:"Admin not Found"
            })
        }
        next()
    }
    catch(error){
        return res.status(500).json({success:false,message:"ERror in Admin Auth"})
    }
}