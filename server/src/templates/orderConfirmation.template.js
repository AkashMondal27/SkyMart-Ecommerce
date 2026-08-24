// Generate the HTML template for the order confirmation email
const orderConfirmationTemplate = (
    orderId,
    products,
    totalAmount
) => {

    // Generate table rows for each ordered product
    const productRows = products
        .map((product) => {
            const subtotal = product.price * product.quantity;

            return `
                <tr>
                    <td style="
                        padding: 12px;
                        border-bottom: 1px solid #e5e7eb;
                        color: #374151;
                    ">
                        ${product.productName}
                    </td>

                    <td style="
                        padding: 12px;
                        text-align: center;
                        border-bottom: 1px solid #e5e7eb;
                        color: #374151;
                    ">
                        ${product.quantity}
                    </td>

                    <td style="
                        padding: 12px;
                        text-align: right;
                        border-bottom: 1px solid #e5e7eb;
                        color: #374151;
                    ">
                        ₹${product.price.toFixed(2)}
                    </td>

                    <td style="
                        padding: 12px;
                        text-align: right;
                        border-bottom: 1px solid #e5e7eb;
                        color: #111827;
                        font-weight: 600;
                    ">
                        ₹${subtotal.toFixed(2)}
                    </td>
                </tr>
            `;
        })
        .join("");


    // Complete HTML email template
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Order Confirmation</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f3f4f6;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        max-width: 700px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    ">

        <!-- Header -->
        <div style="
            background-color: #260ae0;
            padding: 25px;
            text-align: center;
        ">

            <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
            ">
                SkyMart
            </h1>

            <p style="
                margin: 8px 0 0;
                color: #d1d5db;
                font-size: 14px;
            ">
               Everything You Need, All in One Place.
            </p>

        </div>


        <!-- Main Content -->
        <div style="padding: 30px;">

            <h2 style="
                margin-top: 0;
                color: #111827;
            ">
                Thank you for your order! 🎉
            </h2>

            <p style="
                color: #4b5563;
                line-height: 1.6;
            ">
                Your order has been successfully placed.
                Below are the details of your order.
            </p>


            <!-- Order Information -->
            <div style="
                margin: 25px 0;
                padding: 15px;
                background-color: #f9fafb;
                border-radius: 8px;
            ">

                <p style="
                    margin: 5px 0;
                    color: #374151;
                ">
                    <strong>Order ID:</strong>
                    ${orderId}
                </p>

                <p style="
                    margin: 5px 0;
                    color: #374151;
                ">
                    <strong>Payment Method:</strong>
                    Cash on Delivery
                </p>

            </div>


            <!-- Products Table -->
            <h3 style="
                color: #111827;
                margin-bottom: 15px;
            ">
                Order Items
            </h3>

            <div style="overflow-x: auto;">

                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                ">

                    <thead>

                        <tr style="
                            background-color: #f3f4f6;
                        ">

                            <th style="
                                padding: 12px;
                                text-align: left;
                                color: #374151;
                            ">
                                Product
                            </th>

                            <th style="
                                padding: 12px;
                                text-align: center;
                                color: #374151;
                            ">
                                Quantity
                            </th>

                            <th style="
                                padding: 12px;
                                text-align: right;
                                color: #374151;
                            ">
                                Price
                            </th>

                            <th style="
                                padding: 12px;
                                text-align: right;
                                color: #374151;
                            ">
                                Subtotal
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${productRows}

                    </tbody>

                </table>

            </div>


            <!-- Total -->
            <div style="
                margin-top: 25px;
                padding-top: 15px;
                border-top: 2px solid #111827;
                text-align: right;
            ">

                <p style="
                    margin: 0;
                    font-size: 20px;
                    font-weight: bold;
                    color: #111827;
                ">
                    Total Amount:
                    ₹${Number(totalAmount).toFixed(2)}
                </p>

            </div>


            <!-- Footer Message -->
            <div style="
                margin-top: 30px;
                padding: 20px;
                background-color: #f9fafb;
                border-radius: 8px;
                text-align: center;
            ">

                <p style="
                    margin: 0;
                    color: #4b5563;
                    font-size: 14px;
                ">
                    Thank you for shopping with SkyMart.
                </p>

                <p style="
                    margin: 8px 0 0;
                    color: #6b7280;
                    font-size: 13px;
                ">
                    We hope to see you again soon!
                </p>

            </div>

        </div>


        <!-- Footer -->
        <div style="
            padding: 20px;
            text-align: center;
            background-color: #111827;
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

export default orderConfirmationTemplate;