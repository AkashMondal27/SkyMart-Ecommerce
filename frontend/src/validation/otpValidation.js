
export const validateOtp = (otp) => {

    // 1. Check if OTP is entered
    if (!otp || otp.trim() === "") {
        return {
            valid: false,
            message: "OTP is required",
        };
    }

    // 2. Check that OTP contains numbers only
    if (!/^\d+$/.test(otp)) {
        return {
            valid: false,
            message: "OTP must contain numbers only",
        };
    }

    // 3. Check OTP length
    if (otp.length !== 6) {
        return {
            valid: false,
            message: "OTP must be exactly 6 digits",
        };
    }

    // 4. OTP passed frontend validation
    return {
        valid: true,
        otp,
    };
};