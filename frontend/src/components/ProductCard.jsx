import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const ProductCard = ({ product, latest }) => {
    if (!product) return null;

    return (
        <div
            className="
                group w-full max-w-70 mx-auto overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800
                bg-gray-100 dark:bg-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

            {/* Product Image */}
            
                <div
                    className="
                        relative  h-55 bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden ">

                    {/* New Badge */}
                    {latest === "yes" && (
                        <Badge
                            className=" absolute top-3 left-3 z-10 rounded-full bg-green-600 px-2.5 py-1 text-xs font-medium ">
                            New
                        </Badge>
                    )}

                    {/* Product Image */}
                    <img
                        src={product.images?.[0]?.url}
                        alt={product.title || "Product"}
                        className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                </div>
            

            {/* Product Information */}
            <div className="p-3.5">

                {/* Product Title */}
                <h3 className="text-base font-semibold text-gray-900 dark:text-white  truncate
                                hover:text-orange-500  ">

                    {product.title?.slice(0, 30)}
                </h3>

                {/* Product Description */}
                <p className=" mt-1 text-xs text-gray-700 dark:text-gray-400 line-clamp-2  min-h-8 ">
                    {product.description?.slice(0, 50)}
                </p>

                {/* Price */}
                <p className="mt-2 text-lg font-bold  text-gray-900 dark:text-white">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </p>

                {/* Button */}
                <Button className="mt-3  h-9 rounded-lg text-sm bg-blue-900 text-white hover:bg-orange-600
               dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-orange-500 dark:hover:text-white">

                    <Link
                        to={`/products/${product._id}`}
                        className="flex items-center justify-center"
                    >
                        See Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </Button>

            </div>
        </div>
    );
};

export default ProductCard;