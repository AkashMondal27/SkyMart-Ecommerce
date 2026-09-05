import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
            <div className="grid w-full max-w-4xl items-center gap-8 lg:grid-cols-2 md:gap-10">

                {/* Left - Image */}
                <div className="flex items-center justify-center">
                    <div className="h-56 w-56 sm:h-80 sm:w-80">
                        <img
                            src="/empthyCardImage.png"
                            alt="Empty shopping cart"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>

                {/* Right - Content */}
                <div className="text-center md:text-left">

                    <span className="text-sm font-medium tracking-wide text-primary">
                        SHOPPING CART
                    </span>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Your cart is empty
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                        Looks like you haven't added anything to your cart yet.
                        Take a look at our collection and discover products
                        that are perfect for you.
                    </p>

                    {/* Buttons */}
                    <div className="mt-7 flex flex-col gap-3 md:flex-row sm:flex-row md:justify-start">
                        <Button
                            size="lg"
                            className="rounded-full px-6"
                            onClick={() => navigate("/products")}
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Explore Products
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                       

                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-6"
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmptyCart;