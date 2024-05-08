import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error verifying transporter:", error);
    } else {
        console.log("Transporter is ready to send emails");
    }
});
export default transporter;
