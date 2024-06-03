import nodemailer from "nodemailer";
import dotenv from "dotenv";
import __dirname from "../utils/dirname.js";

dotenv.config({
    path: `${__dirname}/.env`
});


const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        // type: "OAuth2",
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error verifying transporter:", error);
    } else {
        console.log(`Transporter is ready to send emails ${success}`);
    }
});
export default transporter;
