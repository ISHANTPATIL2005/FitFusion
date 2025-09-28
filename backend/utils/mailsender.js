const nodemailer = require('nodemailer');
require("dotenv").config();

const mailsender = async (email, title, body) => {
    try {
        if (!email || !email.includes("@")) {
            throw new Error("Invalid recipient email provided");
        }

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // use 465 if SSL
            secure: false, // true for port 465
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        console.log("Sending mail to:", email);

        let info = await transporter.sendMail({
            from: `"Admin" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error in mailsender:", error);
        throw error; // rethrow actual error
    }
};

module.exports = mailsender;
