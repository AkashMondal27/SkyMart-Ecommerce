import { server } from "@/main";
import Loading from "@/components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import {
    ShoppingBag,
    Package,
    ArrowRight,
    CalendarDays,
    IndianRupee,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(
                    `${server}/api/v1/order/all`,
                    {
                        headers: {
                            token: Cookies.get("token"),
                        },
                    }
                );

                setOrders(data.data || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <Loading />;
    }

    // Empty Orders
    if (orders.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg text-center">

                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                        <ShoppingBag
                            className="h-12 w-12 text-muted-foreground"
                            strokeWidth={1.5}
                        />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold">
                        No Orders Yet
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-6 text-muted-foreground">
                        You haven't placed any orders yet. Explore our products
                        and place your first order today.
                    </p>

                    <Button
                        onClick={() => navigate("/products")}
                        className="mt-7 w-full sm:w-auto"
                    >
                        Start Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <Package className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Your Orders
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Track and manage your orders
                            </p>
                        </div>

                    </div>

                    <div className="mt-6 h-px bg-border" />
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                    {/* {orders.map((order) => { */}
                    {orders.map((order, index) => {
                        const colors = [
                            {
                                button: "bg-blue-600 hover:bg-blue-700",
                                border: "hover:border-blue-500/40",
                                shadow: "hover:shadow-[0_8px_30px_rgba(37,99,235,0.18)]",
                            },
                            {
                                button: "bg-purple-600 hover:bg-purple-700",
                                border: "hover:border-purple-500/40",
                                shadow: "hover:shadow-[0_8px_30px_rgba(147,51,234,0.18)]",
                            },
                            {
                                button: "bg-emerald-600 hover:bg-emerald-700",
                                border: "hover:border-emerald-500/40",
                                shadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]",
                            },
                            {
                                button: "bg-orange-600 hover:bg-orange-700",
                                border: "hover:border-orange-500/40",
                                shadow: "hover:shadow-[0_8px_30px_rgba(234,88,12,0.18)]",
                            },
                            {
                                button: "bg-pink-600 hover:bg-pink-700",
                                border: "hover:border-pink-500/40",
                                shadow: "hover:shadow-[0_8px_30px_rgba(219,39,119,0.18)]",
                            },
                        ];

                        const color = colors[index % colors.length];

                        const status = order.status;

                        const statusStyle =
                            status === "Delivered"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : status === "Cancelled"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : status === "Shipped"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                        : status === "Processing"
                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

                        return (

                            <Card key={order._id}
                                className={` group overflow-hidden border-border/60  shadow-sm
                                                transition-all duration-300   hover:-translate-y-1
                                                        ${color.border}
                                                         ${color.shadow} `}>

                                {/* Card Header */}
                                <CardHeader className="pb-4">

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Order ID
                                            </p>

                                            <CardTitle className="mt-1 truncate text-base font-semibold">
                                                #{order._id}
                                            </CardTitle>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                                        >
                                            {status}
                                        </span>

                                    </div>

                                </CardHeader>

                                <CardContent>

                                    {/* Order Information */}
                                    <div className="space-y-4">

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <ShoppingBag className="h-4 w-4" />
                                                <span>Total Items</span>
                                            </div>

                                            <span className="text-sm font-semibold">
                                                {order.items?.length || 0}
                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CalendarDays className="h-4 w-4" />
                                                <span>Placed On</span>
                                            </div>

                                            <span className="text-sm font-medium">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Amount */}
                                    <div className="my-5 border-t border-border" />

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-muted-foreground">
                                            Order Total
                                        </span>

                                        <div className="flex items-center text-lg font-bold">
                                            <IndianRupee className="h-4 w-4" />

                                            {Number(
                                                order.subTotal || 0
                                            ).toLocaleString("en-IN")}
                                        </div>

                                    </div>

                                    {/* Payment */}
                                    <div className="mt-2 flex items-center justify-between">

                                        <span className="text-xs text-muted-foreground">
                                            Payment
                                        </span>

                                        <span
                                            className={`text-xs font-semibold ${order.paymentStatus === "Paid"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-yellow-600 dark:text-yellow-400"
                                                }`}
                                        >
                                            {order.paymentStatus}
                                        </span>

                                    </div>

                                    {/* Button */}

                                    <Button className={`mt-6 w-full text-white transition-all duration-300 hover:shadow-md
                                                      ${color.button}  `}
                                        onClick={() => navigate(`/order/${order._id}`)}>
                                        View Order Details
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>

                                </CardContent>
                            </Card>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default Order;