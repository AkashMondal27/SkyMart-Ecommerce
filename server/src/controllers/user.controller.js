import { asyncHandler } from "../utils/asyncHandler.js";
import sendOtp from "../utils/sendOtp.js";
import OTP from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";



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


/*-----------------------------------------------------------------------------
           Verify OTP and create user if not exists
-------------------------------------------------------------------------------*/

export const verifyUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const lowerCaseEmail = email.toLowerCase().trim();

    const haveOtp = await OTP.findOne({
        email: lowerCaseEmail,
        otp: otp
    });

    if (!haveOtp) {
        throw new ApiError(400, "Invalid OTP");
    };

    let user =await User.findOne({
        email: lowerCaseEmail
    });

    if (user) {  // if user exists, generate JWT token and return success response
        const token = jwt.sign(
            {
                _id: user._id,
            }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });


        await OTP.deleteOne();

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "User logged in successfully  👍"
            )
        );
    } else { // if user does not exist, create a new user
        user = await User.create({
            email: lowerCaseEmail,
            isVerified: true
        });
        const token = jwt.sign(
            {
                _id: user._id,
            }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });


        await OTP.deleteOne();

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "User logged in successfully  👍"
            )
        );
    }

})


