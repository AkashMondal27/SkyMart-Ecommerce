import Loading from "@/components/Loading";


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductData } from "@/context/ProductContext";

import { UserData } from "@/context/UserContext";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    ShoppingCart,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

const ProductPage = () => {
    const { id } = useParams();
    const { isAuth } = UserData();

    const {
        loading,
        product,
        relatedProducts,
        fetchProduct,
    } = ProductData();

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    // Loading
    if (loading) {
        return <Loading />;
    }

    // Product not found
    if (!product) {
        return (
            <div className="container flex min-h-[50vh] items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">
                        Product not found
                    </h1>

                    <Link
                        to="/products"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    // outof Stock logic
    const isOutOfStock = product.stock <= 0;

    return (
        <main className="container px-6 py-6 md:py-8">
            <div className="mx-auto max-w-6xl">

                {/* Back Button */}
                <Link
                    to="/products"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 " />
                    Back to Products
                </Link>

                {/* Product */}
                <div className="grid grid-cols-1 gap-7 md:grid-cols-[360px_1fr] md:gap-10">

                    {/* ================= IMAGE ================= */}
                    <div className="w-full px-1">
                        <div className="overflow-hidden rounded-xl bg-transparent">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {product.images?.map((image, index) => (
                                        <CarouselItem key={index}>
                                            <div className="flex h-70 sm:h-75 w-full items-center justify-center bg-transparent">
                                                <img
                                                    src={image.url}
                                                    alt={`${product.title} image ${index + 1}`}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {product.images?.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-1 h-8 w-8 border bg-background/80 shadow-sm hover:bg-accent" />
                                        <CarouselNext className="right-1 h-8 w-8 border bg-background/80 shadow-sm hover:bg-accent" />
                                    </>
                                )}
                            </Carousel>
                        </div>

                        {product.images?.length > 1 && (
                            <p className="mt-2 text-center text-xs text-muted-foreground">
                                {product.images.length} images
                            </p>
                        )}
                    </div>

                    {/* ================= DETAILS ================= */}
                    <div className="flex flex-col justify-center px-3 sm:px-0">

                        {/* Product Name */}
                        <h1 className="text-2xl font-bold leading-tight tracking-tight">
                            {product.title}
                        </h1>

                        {/* Description */}
                        <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/80">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="mt-5">
                            <p className="text-2xl font-bold">
                                ₹ {product.price}
                            </p>
                        </div>

                        {/* Availability */}
                        <div className="mt-4">
                            {isOutOfStock ? (
                                <div className="inline-flex items-center gap-2 text-sm 
                                        font-semibold text-red-600 dark:text-red-400">
                                    <XCircle className="h-4 w-4" />
                                    Out of Stock
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 text-sm font-semibold
                                                text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Available
                                    <span className="font-normal text-foreground/75">
                                         ( {product.stock} in stock )
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Add To Cart */}
                        <div className="mt-5">
                            {isAuth ? (
                                <Button className={" bg-green-700 hover:bg-orange-600 "}
                                    disabled={isOutOfStock}

                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {isOutOfStock
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Please{" "}
                                    <Link
                                        to="/login"
                                        className="font-semibold text-primary hover:underline"
                                    >
                                        login
                                    </Link>{" "}
                                    to add this product to your cart.
                                </p>
                            )}
                        </div>
                    </div>
                </div>


              
                {/* ================= RELATED PRODUCTS ================= */}
                {relatedProducts?.length > 0 && (
                    <section className="mt-16 border-t pt-12">

                        {/* Section Header */}
                        <div className="mb-8 flex items-end justify-between">

                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Related Products
                                    </h2>

                                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                        {relatedProducts.length}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Similar products you may be interested in
                                </p>
                            </div>

                            
                        </div>

                        <div className="grid  gap-5  grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  ">
                                   
                            {relatedProducts.map((item) => (
                                <ProductCard
                                    key={item._id}
                                    product={item}
                                />
                            ))}
                        </div>

                       

                    </section>
                )}

            </div>
        </main>
    );
};

export default ProductPage;