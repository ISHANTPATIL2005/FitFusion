const express = require('express');
const router = express.Router();

const{signup,checkOtp,login,userDetails,deleteUser}=require("../Controllers/Auth")

router.post("/Signup",signup)
router.post("/checkOtp",checkOtp)
router.post("/login",login)
router.post("/userDetails",userDetails)
router.delete("deleteUser",deleteUser)



module.exports=router


