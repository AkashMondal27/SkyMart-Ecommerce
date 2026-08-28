import { asyncHandler } from "../utils/asyncHandler.js";
import sendOtp from "../utils/sendOtp.js";
import OTP from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


/* ============================================================
  Send OTP to user email for login or registration
=============================================================== */

//  Allowed email providers
const allowedEmailDomains = [
    // Google
    "gmail.com",

    // Microsoft
    "outlook.com",
    "hotmail.com",
    "live.com",
    "msn.com",

    // Yahoo
    "yahoo.com",
    "ymail.com",
    "rocketmail.com",

    // Apple
    "icloud.com",
    "me.com",
    "mac.com",

    // Proton
    "proton.me",
    "protonmail.com",

    // Other popular providers
    "aol.com",
    "gmx.com",
    "mail.com",
    "zoho.com",
    "yandex.com",
    "fastmail.com",
];

export const loginUser = asyncHandler(async (req, res) => {

    const { email } = req.body;

    // 1. Validate email
    if (!email || email.trim() === "") {
    return res.status(400).json({
        success: false,
        message: "Email is Required"
    });
}
 
    const lowerCaseEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(lowerCaseEmail)) {
    throw new ApiError(400, "Please enter a valid email address");
}



//  Get domain from email
const emailDomain = lowerCaseEmail.split("@")[1];

//  Check allowed domain
if (!allowedEmailDomains.includes(emailDomain)) {
    throw new ApiError(
        400,
        "Please enter a valid email address"
    );
}

    // 2. Generate 6-digit OTP
    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const subject = "SkyMart - Email Verification";

    // 3. Delete previous OTP for this email
    await OTP.deleteMany({
        email: lowerCaseEmail
    });


    // 4. Hash OTP
    const hashedOtp = await bcrypt.hash(
        otp,
        10
    );

    console.log("Original OTP:", otp);
    console.log("Hashed OTP:", hashedOtp);

    // 5. Save HASHED OTP in MongoDB
    const savedOtp = await OTP.create({
        email: lowerCaseEmail,
        otp: hashedOtp
    });

    console.log("✅ OTP SAVED:", savedOtp);

    // 6. Send  Original OTP to Gmail
    await sendOtp(
        lowerCaseEmail,
        subject,
        otp
    );


    
    // 7. Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "OTP sent successfully to your email  👍"
        )
    );
});


/*========================================================
           Verify OTP and create user if not exists
========================================================*/

export const verifyUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

     // 1. Validate input
    if (!email || !otp) {
        throw new ApiError(
            400,
            "Email and OTP are required"
        );
    }

    const lowerCaseEmail = email.toLowerCase().trim();

    // 2. Find OTP using emai/
    const haveOtp = await OTP.findOne({
        email: lowerCaseEmail,   
    });

    if (!haveOtp) {
        throw new ApiError(
            400, 
           "OTP not found or expired"
        );
    };


    // 3. Check OTP expiration
    if (haveOtp.expiresAt < new Date()) {

        await OTP.deleteOne({
            _id: haveOtp._id
        });

        throw new ApiError(
            400,
            "OTP has expired"
        );
    }

 // 4. Compare entered OTP with hashed OTP
    const isOtpCorrect = await bcrypt.compare(
        otp.toString(),
        haveOtp.otp
    );

    if (!isOtpCorrect) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }

 // 5. Find user
    let user = await User.findOne({
        email: lowerCaseEmail
    });
 
    /*-------------------------------------------------------------------
       if user exists, generate JWT token and return success response
    --------------------------------------------------------------------*/ 
    if (user) { 
        const token = jwt.sign(
            {
                _id: user._id,
            }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });


        await OTP.deleteOne({
            _id: haveOtp._id
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        email: user.email,
                        isVerified: user.isVerified
                    },
                    token
                },
                "User logged in successfully 👍"
            )
        );
    } 
    /*-------------------------------------------------------------------
       if user does not exist, create new user, generate JWT token and return success response
    --------------------------------------------------------------------*/
    else { 
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


        await OTP.deleteOne({
            _id: haveOtp._id
        });
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        email: user.email,
                        isVerified: user.isVerified
                    },
                    token
                },
                "User logged in successfully 👍"
            )
        );
    }

})


