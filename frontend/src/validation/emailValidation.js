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

export const validateEmail = (email) => {

    // 1. Required
    if (!email || email.trim() === "") {
        return {
            valid: false,
            message: "Email is required",
        };
    }

    // 2. Clean email
    const cleanEmail = email.trim().toLowerCase();

    // 3. Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
        return {
            valid: false,
            message: "Please enter a valid email address",
        };
    }

    // 4. Domain
    const emailDomain = cleanEmail.split("@")[1];

    if (!allowedEmailDomains.includes(emailDomain)) {
        return {
            valid: false,
            message: "Please enter a valid email address",
        };
    }

    return {
        valid: true,
        email: cleanEmail,
    };
};