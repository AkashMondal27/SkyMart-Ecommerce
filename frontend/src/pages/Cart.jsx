import { Button } from "@/components/ui/button";
import { CartData } from "@/context/CartContext";
import { TrashIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import EmptyCart from "@/components/EmptyCart";

const Cart = () => {
    const {
        cart,
        totalItem,
        subTotal,
        updateCart,
        removeFromCart,
    } = CartData();

    const navigate = useNavigate();

    const updateCartHandler = async (action, id) => {
        await updateCart(action, id);
    };

    return (
        <div className="container mx-auto w-full px-4 py-8 sm:px-6">

            {/* Page Title */}
            <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
                Your Cart
            </h1>

            {/* Empty Cart */}
            {cart?.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="grid w-full items-start gap-6 lg:grid-cols-3">

                    {/* ================= PRODUCTS ================= */}
                    <div className="min-w-0 space-y-4 lg:col-span-2">

                        {cart.map((e) => (
                            <div
                                key={e._id}
                                className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 gap-y-3
                                           rounded-xl border border-border/60 bg-card p-3 shadow-sm
                                            transition-all duration-200 hover:border-border  
                                            hover:shadow-md dark:bg-card/80 dark:shadow-black/20
                                            sm:grid-cols-[80px_minmax(0,1fr)_auto_auto] sm:items-center
                                            sm:gap-4 sm:p-4 ">

                                {/* ================= IMAGE ================= */}
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
                                    <img
                                        src={e.product?.images?.[0]?.url}
                                        alt={e.product?.title}
                                        className="h-full w-full cursor-pointer object-contain
                                                  transition-transform hover:scale-105"
                                            
                                        onClick={() =>
                                            navigate(
                                                `/products/${e.product?._id}`
                                            )
                                        }
                                    />
                                </div>

                                {/* ================= PRODUCT DETAILS ================= */}
                                <div className="min-w-0 self-center">
                                    <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
                                        {e.product?.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Price: ₹{e.product?.price}
                                    </p>
                                </div>

                                {/* ================= QUANTITY ================= */}
                                <div
                                    className="col-span-1  flex items-center gap-2 sm:col-auto">

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 border-border/70 bg-background 
                                                  font-medium hover:bg-orange-400 dark:bg-background/50 
                                                  dark:hover:bg-orange-700  "
                                        onClick={() =>
                                            updateCartHandler(
                                                "dec",
                                                e._id
                                            )
                                        }
                                    >
                                        -
                                    </Button>

                                    <span className="w-6 text-center text-sm font-medium">
                                        {e.quantity}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 border-border/70 bg-background 
                                                  font-medium hover:bg-orange-400 dark:bg-background/50 
                                                  dark:hover:bg-orange-700"
                                        onClick={() =>
                                            updateCartHandler(
                                                "inc",
                                                e._id
                                            )
                                        }
                                    >
                                        +
                                    </Button>
                                </div>

                                {/* ================= REMOVE ================= */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="col-start-2 row-start-2 justify-self-end  text-muted-foreground
                                                transition-colors   hover:bg-red-500/10 hover:text-red-500
                                              dark:hover:bg-red-500/10 dark:hover:text-red-400
                                                sm:col-auto sm:row-auto "
                                    onClick={() =>
                                        removeFromCart(e._id)
                                    }
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* ================= ORDER SUMMARY ================= */}
                    <div className="min-w-0 lg:sticky lg:top-24">

                        <div className="rounded-xl border border-border/60 bg-card p-5 
                                        shadow-sm dark:bg-card/90  dark:shadow-black/20
                                         sm:p-6">

                            <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                Order Summary
                            </h2>

                            <div className="my-5 border-t" />

                            {/* Total Items */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total Items
                                </span>

                                <span className="font-medium text-foreground">
                                    {totalItem}
                                </span>
                            </div>

                            {/* Subtotal */}
                            <div className="mt-4 flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>

                                <span className="font-medium text-foreground">
                                    ₹{subTotal}
                                </span>
                            </div>

                            <div className="my-5 border-t" />

                            {/* Total */}
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">
                                    Total
                                </span>

                                <span className="text-xl font-bold tracking-tight">
                                    ₹{subTotal}
                                </span>
                            </div>

                            {/* Checkout */}
                            <Button
                                className="mt-6 w-full font-medium shadow-sm 
                                           transition-all hover:bg-orange-400
                                           dark:hover:bg-orange-700 hover:shadow-md"

                                size="lg"
                                disabled={cart.length === 0}
                                onClick={() => navigate("/checkout")}
                            >
                                Checkout
                            </Button>

                            {/* Continue Shopping */}
                            <Button
                                variant="ghost"
                                className="mt-2 w-full  text-muted-foreground hover:text-foreground"
                                onClick={() => navigate("/products")}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;