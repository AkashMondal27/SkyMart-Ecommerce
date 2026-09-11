import Loading from "@/components/Loading";
import Cookies from "js-cookie";
import { server } from "@/main";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductData } from "@/context/ProductContext";

import { UserData } from "@/context/UserContext";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowUp,
    CheckCircle2,
    ShoppingCart,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { CartData } from "@/context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";


const ProductPage = () => {
    const { id } = useParams();
    const { isAuth, user } = UserData();
    const { cart, addToCart } = CartData();

    const {
        loading,
        product,
        relatedProducts,
        fetchProduct,
    } = ProductData();


    // Up Arrow setup on related product 
    const [showAllRelated, setShowAllRelated] = useState(false);

    // Admin edit states
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);


    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);


    // ================= NOW CONDITIONAL RETURNS =================

    if (loading) {
        return <Loading />;
    }


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


    // Find this product in the current user's cart
    const cartItem = cart?.find(
        (item) => item.product?._id === product._id
    );

    // How many of this product the current user already has
    const cartQuantity = cartItem?.quantity || 0;

    // How many this user can still add
    const remainingStock = product.stock - cartQuantity;

    // Control frontend availability
    const isOutOfStock = remainingStock <= 0;

    //add to card logic
    const addToCartHandler = () => {
        if (remainingStock <= 0) {
            toast.error("You have reached the available quantity");
            return;
        }

        addToCart(id);
    };

    // // Make logic so admin can edit the product
    // const [show, setShow] = useState(false);
    // const [title, setTitle] = useState("")
    // const [description, setDescription] = useState("")
    // const [price, setPrice] = useState("")
    // const [category, setCategory] = useState("")
    // const [stock, setStock] = useState("")

    // const [btnLoading, setBtnLoading] = useState(false)


    // const updateHandlaer=()=>{
    //     setShow(!show)
    //     setCategory(product.category)
    //     setTitle(product.title)
    //     setDescription(product.description)
    //     setStock(product.stock)
    //     setPrice(product.price)
    // }


    // const submitHandler=async(e)=>{
    //     e.preventDefault();
    //     setBtnLoading(true)

    //     try {
    //         const{data}=await axios.put(`${server}/api/v1/products/${id}` ,{
    //             title,description,price,stock, category
    //         },{
    //             headers:{
    //                 token:Cookies.get("token")
    //             }
    //         })

    //         toast.success(data.message),
    //         fetchProduct(id)
    //         setShow(false)

    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.response.data.message)
    //     }finally{
    //         setBtnLoading(false)
    //     }
    // }






    // Open edit form and load current product data
    const updateHandler = () => {
        setTitle(product.title || "");
        setDescription(product.description || "");
        setPrice(product.price ?? "");
        setCategory(product.category || "");
        setStock(product.stock ?? "");

        setShow((prev) => !prev);
    };

    // Submit updated product
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Product title is required");
            return;
        }

        if (!description.trim()) {
            toast.error("Product description is required");
            return;
        }

        if (!category.trim()) {
            toast.error("Product category is required");
            return;
        }

        if (price === "" || Number(price) < 0) {
            toast.error("Enter a valid price");
            return;
        }

        if (stock === "" || Number(stock) < 0) {
            toast.error("Enter a valid stock quantity");
            return;
        }

        setBtnLoading(true);

        try {
            const { data } = await axios.put(
                `${server}/api/v1/products/${id}`,
                {
                    title: title.trim(),
                    description: description.trim(),
                    price: Number(price),
                    stock: Number(stock),
                    category: category.trim(),
                },
                {
                    headers: {
                        token: Cookies.get("token"),
                    },
                }
            );

            toast.success(data.message || "Product updated successfully");

            await fetchProduct(id);

            setShow(false);
        } catch (error) {
            console.error("Update product error:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to update product"
            );
        } finally {
            setBtnLoading(false);
        }
    };




    return (
        <main className="w-full px-4 py-6 sm:px-6 md:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">

                {/* Back Button */}
                <Link
                    to="/products"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4 " />
                    Back to Products
                </Link>

                {/* Product */}
                {/* <div className="grid grid-cols-1 gap-7 md:grid-cols-[360px_1fr] md:gap-10"> */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[420px_1fr] md:gap-16 lg:grid-cols-[460px_1fr] lg:gap-20">


                    {/* ================= IMAGE ================= */}
                    <div className="w-full ">
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

                                </div>
                            )}
                        </div>

                        {/* Add To Cart */}
                        <div className="mt-5">
                            {isAuth ? (
                                <Button className={" bg-green-700 hover:bg-orange-600 "}
                                    disabled={isOutOfStock}
                                    onClick={addToCartHandler}


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
                        {/* Admin Edit Button */}
                        {isAuth && user?.role === "admin" && (
                            <Button
                                type="button"
                                onClick={updateHandler}
                                className="mt-4 w-fit"
                            >
                                {show ? "Cancel Edit" : "Edit Product"}
                            </Button>
                        )}
                    </div>
                </div>


                {/* -------------------------------------------------------------
                    Admin Edit Form 
                ----------------------------------------------------------------- */}
                {isAuth && user?.role === "admin" && show && (
                    <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-bold">
                            Edit Product
                        </h2>

                        <form onSubmit={submitHandler} className="space-y-5">

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Product title"
                                className="w-full rounded-lg border bg-background px-4 py-3"
                            />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Product description"
                                rows={4}
                                className="w-full rounded-lg border bg-background px-4 py-3"
                            />

                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Category"
                                className="w-full rounded-lg border bg-background px-4 py-3"
                            />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <input
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Price"
                                    className="w-full rounded-lg border bg-background px-4 py-3"
                                />

                                <input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="Stock"
                                    className="w-full rounded-lg border bg-background px-4 py-3"
                                />

                            </div>

                            <div className="flex gap-3">

                                <Button
                                    type="submit"
                                    disabled={btnLoading}
                                >
                                    {btnLoading ? "Updating..." : "Update Product"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShow(false)}
                                    disabled={btnLoading}
                                >
                                    Cancel
                                </Button>

                            </div>

                        </form>
                    </div>
                )}


                {/* ================= RELATED PRODUCTS ================= */}



                {relatedProducts?.length > 0 && (
                    <section className="mt-16 border-t border-gray-200 dark:border-blue-900/40 pt-12">

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

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                            {(showAllRelated
                                ? relatedProducts
                                : relatedProducts.slice(0, 4)
                            ).map((item) => (
                                <ProductCard
                                    key={item._id}
                                    product={item}
                                />
                            ))}
                        </div>

                        {/* View All Button */}
                        {!showAllRelated && relatedProducts.length > 4 && (
                            <div className="mt-10 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setShowAllRelated(true)}
                                    className="rounded-lg border bg-accent px-7 py-3 text-sm font-semibold 
                                               shadow-sm transition-all hover:bg-gray-300
                                              dark:hover:bg-blue-950 hover:shadow-md cursor-pointer"
                                >
                                    View All Related Products
                                </button>
                            </div>
                        )}

                    </section>
                )}

                {/* Back to Top Button */}
                {showAllRelated && relatedProducts.length > 4 && (
                    <button
                        type="button"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        aria-label="Back to top"
                        title="Back to top"
                        className="fixed bottom-24 right-6 z-50 flex h-11 w-11 items-center justify-center
                                   rounded-full border border-border bg-background text-foreground
                                   shadow-md  transition-all duration-200 hover:bg-accent hover:shadow-lg
                                   hover:text-accent-foreground dark:border-blue-400/40 dark:bg-slate-800
                                   dark:text-white dark:hover:bg-slate-700 dark:hover:border-blue-400/70
                                    ">

                        <ArrowUp className="h-5 w-5" />
                    </button>
                )}

            </div>
        </main>



    );
};

export default ProductPage;