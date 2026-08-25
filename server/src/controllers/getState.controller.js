import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getStats = asyncHandler(async (req, res) => {
    // Only admin can update order status
    if (req.user.role !== "admin") {
        return res.status(403).json(
            new ApiError(
                403,
                null,
                "Access denied. You are not an ADMIN!"
            )
        );
    }

    const cod = await Order.find({ method: "cod" }).countDocuments();
    const online = await Order.find({ method: "online" }).countDocuments();

    const products = await Product.find();

    const data = products.map((prod) => ({
        name: prod.title,
        sold: prod.sold
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                cod,
                online,
                products: data
            },
            "Stats fetched successfully"
        )
    );

})