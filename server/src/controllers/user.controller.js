import { asyncHandler } from "../utils/asyncHandler.js";
import sendOtp from "../utils/sendOtp.js";
import OTP from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//It is besically  handle the Registration with otp .
export const loginUser = asyncHandler(async (req, res) => {

    const { email } = req.body;

    // 1. Validate email
    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required");
    }

    const lowerCaseEmail = email.toLowerCase().trim();

    // 2. Generate 6-digit OTP
    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const subject = "SkyMart - Email Verification";

    // 3. Delete previous OTP for this email
    await OTP.deleteMany({
        email: lowerCaseEmail
    });

    // 4. Save new OTP
    // await OTP.create({
    //     email: lowerCaseEmail,
    //     otp: otp
    // });
    const savedOtp = await OTP.create({
        email: lowerCaseEmail,
        otp: otp
    });

    console.log("✅ OTP SAVED:", savedOtp);

    // 5. Send OTP to Gmail
    await sendOtp(
        lowerCaseEmail,
        subject,
        otp
    );

    // 6. Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "OTP sent successfully to your email 👍"
        )
    );
});