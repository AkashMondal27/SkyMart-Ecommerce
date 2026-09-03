import { asyncHandler } from "../utils/asyncHandler.js"
import { Product } from "../models/product.model.js"

const getSingleProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return res.status(404).json({
            statusCode: 404,
            message: "Product not found"
        })
    }

    const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
    })


    res.json({
        product,
        relatedProducts: relatedProducts
    })
})

export { getSingleProduct }
