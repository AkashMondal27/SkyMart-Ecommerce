import { CartData } from "@/context/CartContext";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import { useEffect,useRef,useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const OrderProcessing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchCart } = CartData();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const verificationStarted = useRef(false);
    

    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    useEffect(() => {
        const verifyPayment = async () => {
            if (verificationStarted.current) return;

    verificationStarted.current = true;
            if (!sessionId) {
                toast.error("Session ID missing");
                navigate("/cart");
                return;
            }

            try {
                const { data } = await axios.post(
                    `${server}/api/v1/order/verify`,
                    { sessionId },
                    {
                        headers: {
                            token: Cookies.get("token"),
                        },
                    }
                );
                console.log('Success:', data);
                

                if (data.success) {
                    setSuccess(true);
                    toast.success("Order placed successfully");

                    await fetchCart();

                    setTimeout(() => {
                        navigate("/order");
                    }, 1500);
                    
                } else {
                    toast.error("Payment verification failed");
                    navigate("/cart");
                }
            } catch (error) {
                 console.error("Payment verification error:", error);
                toast.error(
                    error?.response?.data?.message ||
                        "Payment verification failed"
                );

                navigate("/cart");
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId, navigate, fetchCart]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">

                    {loading ? (
                        <>
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight">
                                Processing your order
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                Please wait while we verify your payment.
                                <br />
                                Do not close or refresh this page.
                            </p>

                            <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
                            </div>

                            <p className="mt-4 text-xs text-muted-foreground">
                                Securely processing your payment
                            </p>
                        </>
                    ) : success ? (
                        <>
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                                <CheckCircle2 className="h-9 w-9 text-green-600" />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight">
                                Order placed successfully
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                Your payment has been confirmed and your
                                order has been placed successfully.
                            </p>

                            <button
                                onClick={() => navigate("/orders")}
                                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Go to Orders
                            </button>

                            <p className="mt-4 text-xs text-muted-foreground">
                                Redirecting to your orders...
                            </p>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default OrderProcessing;






