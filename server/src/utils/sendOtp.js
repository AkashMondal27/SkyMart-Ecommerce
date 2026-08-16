import { createTransport } from "nodemailer";
import otpTemplate from "../templates/otp.template.js";

const sendOtp = async (email, subject, otp) => {

    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMTP_GMAIL,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        from: `"SkyMart" <${process.env.SMTP_GMAIL}>`,
        to: email,
        subject: subject,

        // Fallback for email clients that don't support HTML
        text: `Your SkyMart OTP is: ${otp}. This OTP will expire in 5 minutes.`,

        // HTML email
        html: otpTemplate(otp)
    });
};

export default sendOtp;