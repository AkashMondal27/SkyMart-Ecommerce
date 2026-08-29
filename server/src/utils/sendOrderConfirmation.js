import { createTransport } from "nodemailer";
import orderConfirmationTemplate from "../templates/orderConfirmation.template.js";


// Send order confirmation email to the customer
const sendOrderConfirmation = async ({
    email,
    subject,
    orderId,
    products,
    totalAmount
}) => {

    // Create SMTP transporter
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),

        // SSL is required for port 465
        secure: Number(process.env.SMTP_PORT) === 465,

        auth: {
            user: process.env.SMTP_GMAIL,
            pass: process.env.SMTP_PASS
        }
    });


    // Generate the HTML email
    const html = orderConfirmationTemplate(
        orderId,
        products,
        totalAmount
    );


    // Send the confirmation email
    await transporter.sendMail({
        from: `"SkyCart" <${process.env.SMTP_GMAIL}>`,
        to: email,
        subject: subject,

        // Plain-text fallback
        text: `
Thank you for your order from SkyCart.

Order ID: ${orderId}

Total Amount: ₹${Number(totalAmount).toFixed(2)}

Your order has been successfully placed.

Thank you for shopping with SkyCart.
        `,

        // HTML email
        html
    });
};


export default sendOrderConfirmation;