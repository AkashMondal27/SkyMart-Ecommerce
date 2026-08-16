const otpTemplate = (otp) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkyMart OTP Verification</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f7fb;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e5e7eb;
    ">

        <!-- Header -->
        <div style="
            background-color: #2563eb;
            padding: 25px;
            text-align: center;
        ">
            <h1 style="
                margin: 0;
                color: white;
                font-size: 30px;
            ">
                SkyMart
            </h1>
        </div>

        <!-- Content -->
        <div style="
            padding: 35px;
            text-align: center;
        ">

            <h2 style="
                color: #111827;
                margin-bottom: 10px;
            ">
                Verify Your Email
            </h2>

            <p style="
                color: #6b7280;
                font-size: 15px;
                line-height: 1.6;
            ">
                Use the verification code below to continue
                creating your SkyMart account.
            </p>

            <!-- OTP -->
            <div style="
                margin: 30px auto;
                padding: 18px;
                background-color: #f3f4f6;
                border-radius: 8px;
                width: 220px;
            ">

                <span style="
                    color: #2563eb;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                ">
                    ${otp}
                </span>

            </div>

            <p style="
                color: #6b7280;
                font-size: 14px;
            ">
                This OTP will expire in
                <strong>5 minutes</strong>.
            </p>

            <p style="
                color: #9ca3af;
                font-size: 13px;
                margin-top: 25px;
            ">
                If you did not request this verification code,
                you can safely ignore this email.
            </p>

        </div>

        <!-- Footer -->
        <div style="
            padding: 18px;
            background-color: #f9fafb;
            text-align: center;
        ">
            <p style="
                margin: 0;
                color: #9ca3af;
                font-size: 12px;
            ">
                © ${new Date().getFullYear()} SkyMart. All rights reserved.
            </p>
        </div>

    </div>

</body>

</html>
`;
};

export default otpTemplate;