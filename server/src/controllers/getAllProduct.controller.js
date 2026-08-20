import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";

// Get all products with search, category, sorting, and pagination
export const getAllProducts = asyncHandler(async (req, res) => {

    // Get search, category, page, and price sorting from the URL
    const { search, category, page, sortByPrice } = req.query;

    // Create an empty filter object for MongoDB
    const filter = {};

    // Check if the user searched for a product
    if (search) {

        // Search the product title without caring about uppercase/lowercase
        filter.title = {
            $regex: search,
            $options: "i"
        };
    }

    // Check if a category was selected
    if (category) {

        // Filter products by the selected category
        filter.category = category;
    }

    // By default, show newest products first
    let sortOption = { createdAt: -1 };

    // Check if the user selected a price sorting option
    if (sortByPrice) {

        // Sort products from low price to high price
        if (sortByPrice === "lowToHigh") {
            sortOption = { price: 1 };

        // Sort products from high price to low price
        } else if (sortByPrice === "highToLow") {
            sortOption = { price: -1 };
        }
    }

    // Show 8 products on each page
    const limit = 8;

    // Calculate how many products should be skipped
    const skip = (page - 1) * limit;

    // Get products according to filter, sorting, and pagination
    const products = await Product.find(filter)
        .sort(sortOption)
        .limit(limit)
        .skip(skip);

    // Get all unique product categories
    const categories = await Product.distinct("category");

    // Get the latest 4 products
    const newProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(4);

    // Count the total number of products
    const countProducts = await Product.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(countProducts / limit);

    // Send all product data back to the frontend
    res.json({
        products,
        categories,
        totalPages,
        newProducts
    });
});