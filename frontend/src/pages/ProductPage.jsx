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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

    const { loading, product, relatedProducts, categories, fetchProduct } =
        ProductData();

    // Up Arrow setup on related product
    const [showAllRelated, setShowAllRelated] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");

    const [updatedImage, setUpdatedImage] = useState([]);

    const [btnLoading, setBtnLoading] = useState(false);
    const [open, setOpen] = useState(false);

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
                    <h1 className="text-xl font-semibold">Product not found</h1>

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
    const cartItem = cart?.find((item) => item.product?._id === product._id);

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

    // Open edit form and load current product data

    const resetForm = () => {
        setTitle(product?.title || "");
        setDescription(product?.description || "");
        setPrice(product?.price ?? "");
        setCategory(product?.category || "");
        setStock(product?.stock ?? "");
        setUpdatedImage([]);
    };

    const handleDialogChange = (value) => {
        setOpen(value);

        if (!value && !btnLoading) {
            resetForm();
        }
    };

    const updateHandler = () => {
        resetForm();
        setOpen(true);
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
             // 1. Update product details
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
                },
            );

             // 2. Update images only when new images are selected
        if (updatedImage.length > 0) {
            const formData = new FormData();

            updatedImage.forEach((image) => {
                formData.append("files", image);
            });

            await axios.post(
                `${server}/api/v1/products/${id}`,
                formData,
                {
                    headers: {
                        token: Cookies.get("token"),
                    },
                }
            );
        }

            toast.success(data.message || "Product updated successfully");

            await fetchProduct(id);
            setUpdatedImage([]);
            setOpen(false);
        } catch (error) {
            console.error("Update product error:", error);

            toast.error(error?.response?.data?.message || "Failed to update product");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 5) {
            toast.error("You can select maximum 5 images");
            return;
        }

        setUpdatedImage(files);
    };

    const removeImage = (index) => {
        setUpdatedImage((prev) => prev.filter((_, i) => i !== index));
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
                            <p className="text-2xl font-bold">₹ {product.price}</p>
                        </div>

                        {/* Availability */}
                        <div className="mt-4">
                            {isOutOfStock ? (
                                <div
                                    className="inline-flex items-center gap-2 text-sm 
                                        font-semibold text-red-600 dark:text-red-400"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Out of Stock
                                </div>
                            ) : (
                                <div
                                    className="inline-flex items-center gap-2 text-sm font-semibold
                                                text-green-600 dark:text-green-400"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Available
                                </div>
                            )}
                        </div>

                        {/* Add To Cart */}
                        <div className="mt-5">
                            {isAuth ? (
                                <Button
                                    className={" bg-green-700 hover:bg-orange-600 "}
                                    disabled={isOutOfStock}
                                    onClick={addToCartHandler}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
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
                                Edit Product
                            </Button>
                        )}
                    </div>
                </div>

                {/* -------------------------------------------------------------
                    Admin Edit Form 
                ----------------------------------------------------------------- */}

                {isAuth && user?.role === "admin" && (
                    <Dialog open={open} onOpenChange={handleDialogChange}>
                        <DialogContent
                            className="
              w-[calc(100%-1.5rem)]
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              border border-slate-200
              bg-white
              p-0
              shadow-2xl

              dark:border-slate-800
              dark:bg-slate-950

              sm:w-full
            "
                        >
                            {/* DIALOG HEADER */}

                            <DialogHeader
                                className="
                border-b border-slate-200
                px-5 py-4
                dark:border-slate-800
                sm:px-6
              "
                            >
                                <DialogTitle
                                    className="
                  text-xl font-bold
                  text-slate-900
                  dark:text-white
                "
                                >
                                    Update Existing Product
                                </DialogTitle>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Update your product to your store inventory.
                                </p>
                            </DialogHeader>

                            {/* ================= FORM ================= */}

                            <form
                                onSubmit={submitHandler}
                                className="space-y-5 px-5 py-5 sm:px-6 sm:py-6"
                            >
                                {/* PRODUCT TITLE */}

                                <div className="space-y-2">
                                    <label
                                        htmlFor="title"
                                        className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                                    >
                                        Product Title
                                    </label>

                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        placeholder="Enter product title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="
                    w-full rounded-xl
                    border border-slate-300
                    bg-white px-4 py-3
                    text-sm text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-blue-500
                  "
                                    />
                                </div>

                                {/* DESCRIPTION */}

                                <div className="space-y-2">
                                    <label
                                        htmlFor="description"
                                        className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        placeholder="Enter product description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="
                    w-full resize-none rounded-xl
                    border border-slate-300
                    bg-white px-4 py-3
                    text-sm text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-blue-500
                  "
                                    />
                                </div>

                                {/* CATEGORY */}

                                <div className="space-y-2">
                                    <label
                                        htmlFor="category"
                                        className="
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="category"
                                        name="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        className="
                    w-full rounded-xl
                    border border-slate-300
                    bg-white px-4 py-3
                    text-sm text-slate-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:focus:border-blue-500
                  "
                                    >
                                        <option value="">Select Category</option>

                                        {categories.map((category) => (
                                            <option value={category} key={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* PRICE + STOCK */}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* PRICE */}

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="price"
                                            className="
                      text-sm font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                                        >
                                            Price
                                        </label>

                                        <div className="relative">
                                            <span
                                                className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-sm font-medium
                        text-slate-500
                        dark:text-slate-400
                      "
                                            >
                                                ₹
                                            </span>

                                            <input
                                                id="price"
                                                name="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="
                        w-full rounded-xl
                        border border-slate-300
                        bg-white
                        py-3 pl-9 pr-4
                        text-sm text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:ring-2 focus:ring-blue-500/20

                        dark:border-slate-700
                        dark:bg-slate-900
                        dark:text-white
                        dark:placeholder:text-slate-500
                      "
                                            />
                                        </div>
                                    </div>

                                    {/* STOCK */}

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="stock"
                                            className="
                      text-sm font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                                        >
                                            Stock
                                        </label>

                                        <input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Enter stock quantity"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            required
                                            className="
                      w-full rounded-xl
                      border border-slate-300
                      bg-white px-4 py-3
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:ring-2 focus:ring-blue-500/20

                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:placeholder:text-slate-500
                    "
                                        />
                                    </div>
                                </div>

                                {/* ================= IMAGES ================= */}

                                <div className="space-y-3">
                                    <div>
                                        <label
                                            htmlFor="images"
                                            className="text-sm font-medium text-slate-700 dark:text-slate-200"
                                        >
                                            Product Images
                                        </label>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Select up to 5 images. JPG, PNG or WEBP recommended.
                                        </p>
                                    </div>

                                    {/* FILE INPUT */}

                                    <label
                                        htmlFor="images"
                                        className="
                    flex cursor-pointer
                    flex-col items-center justify-center
                    rounded-xl
                    border-2 border-dashed
                    border-slate-300
                    bg-slate-50
                    px-4 py-7
                    text-center
                    transition
                    hover:border-blue-400
                    hover:bg-blue-50/50

                    dark:border-slate-700
                    dark:bg-slate-900/60
                    dark:hover:border-blue-500
                    dark:hover:bg-blue-950/20
                  "
                                    >
                                        <div
                                            className="
                      mb-2 flex h-11 w-11
                      items-center justify-center
                      rounded-full
                      bg-blue-100
                      text-xl
                      text-blue-600

                      dark:bg-blue-500/10
                      dark:text-blue-400
                    "
                                        >
                                            ↑
                                        </div>

                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            Click to upload images
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Maximum 5 images
                                        </p>

                                        <input
                                            id="images"
                                            type="file"
                                            name="images"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* IMAGE PREVIEWS */}

                                    {updatedImage.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                            {updatedImage.map((image, index) => (
                                                <div
                                                    key={`${image.name}-${index}`}
                                                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
                                                >
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Product ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white transition hover:bg-red-600"
                                                        aria-label={`Remove image ${index + 1}`}
                                                    >
                                                        ×
                                                    </button>

                                                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                                                        Image {index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ================= ACTIONS ================= */}

                                <div
                                    className="
                  flex flex-col-reverse gap-3
                  border-t border-slate-200
                  pt-5

                  dark:border-slate-800

                  sm:flex-row sm:justify-end
                "
                                >
                                    {/* CANCEL */}

                                    <button
                                        type="button"
                                        disabled={btnLoading}
                                        onClick={() => handleDialogChange(false)}
                                        className="
                    w-full rounded-xl
                    border border-slate-300
                    bg-white px-5 py-2.5
                    text-sm font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-200
                    dark:hover:bg-slate-800

                    sm:w-auto
                  "
                                    >
                                        Cancel
                                    </button>

                                    {/* CREATE */}

                                    <button
                                        type="submit"
                                        disabled={btnLoading}
                                        className="
                    flex w-full
                    items-center justify-center gap-2
                    rounded-xl
                    bg-blue-600
                    px-6 py-2.5
                    text-sm font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    dark:bg-blue-500
                    dark:hover:bg-blue-600

                    sm:w-auto
                  "
                                    >
                                        {btnLoading ? (
                                            <>
                                                <span
                                                    className="
                          h-4 w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                                                />
                                                Update Product
                                            </>
                                        ) : (
                                            "Create Product"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                                <ProductCard key={item._id} product={item} />
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
                                    "
                    >
                        <ArrowUp className="h-5 w-5" />
                    </button>
                )}
            </div>
        </main>
    );
};

export default ProductPage;
