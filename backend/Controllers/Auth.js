const OTP = require("../models/OTP")
const User = require("../models/User");
const Cart = require("../models/Cart");

const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailsender");


const setTempData = new Map()
exports.signup = async (req, res) => {

    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Fill All Require Details"
            })
        }
        const exitinguser = await User.findOne({ email });

        if (exitinguser) {
            return res.status(500).json({
                success: false,
                message: "User are Already Exist"
            })
        }
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        setTempData.set(email, {
            firstName,
            lastName,

            password,

        })

        const otpBody = await OTP.create({ email, otp });


        console.log(setTempData)

      await  mailSender(email, 'Verification Code', `Your OTP is ${otp}`);
        return res.status(200).json({
            success: true,
            otp,
            message: "User otp sent",

        });
    }
    catch (error) {
        return res.status(501).json({ success: false, message: "Error  in signup", error: error.message })
    }
}

exports.checkOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required",
            });
        }

        // 1️⃣ Get the latest OTP entry (sorted by creation time)
        const latestOtpEntry = await OTP.findOne({ otp }).sort({ createdAt: -1 });

        if (!latestOtpEntry) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        // 2️⃣ Expiry check (example: 5 minutes)
        const expiryTime = new Date(latestOtpEntry.createdAt);
        expiryTime.setMinutes(expiryTime.getMinutes() + 5);

        if (new Date() > expiryTime) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        const email = latestOtpEntry.email;

        // 3️⃣ Get stored signup data
        const storedData = setTempData.get(email);
        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: "No signup data found for this email",
            });
        }

        // 4️⃣ Hash password
        const hashedPassword = await bcrypt.hash(storedData.password, 10);

        // 5️⃣ Create User
        const user = await User.create({
            firstName: storedData.firstName,
            lastName: storedData.lastName,
            email,
            password: hashedPassword,
        });

        // 6️⃣ Cleanup
        await OTP.deleteMany({ email });
        setTempData.delete(email);

        return res.status(200).json({
            success: true,
            message: "User Signup Successful",
            user,
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Signup verification failed",
            error: error.message,
        });
    }
};


exports.login = async (req, res) => {
    console.log("Login request received");
    console.log("req body:", req.body);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'Fill all details',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ success: false, message: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password',
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };


let cart = await Cart.findOne({ email: user.email });
if (!cart) {
    cart = await Cart.create({
        email: user.email,
        items: []
    });
    console.log("New cart created for user:", user.email);
}

        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: 'Login successful',
            token,
            cartId: cart._id // send back cart id if needed
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error occurred during login',
            error: error.message
        });
    }
};


exports.userDetails = async (req, res) => {
    try {
        const id = req.user.id;
        console.log(id);
        
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Can not get user details"
            })
        }

        return res.status(200).json({
            success: true,
            // message: "user Detatils",
            error:error.message,
            user
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in User Details"
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.parmas
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" })
        }

        await User.findByIdAndDelete({ userId })
        return estimatedDocumentCount.status(200).json({
            success: true,
            message: "user deleted"
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error in userd deleted" })
    }
}