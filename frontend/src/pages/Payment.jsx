import { CartData } from "@/context/CartContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { server } from "@/main";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { LocateIcon, Phone } from "lucide-react";

const Payment = () => {
  const {
    cart,
    subTotal,
    totalItem,
    fetchCart,
  } = CartData();

  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch selected address
  const fetchAddress = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/v1/address/${id}`,
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      setAddress(data?.data?.address);
    } catch (error) {
      console.error("Address fetch error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch address"
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchAddress();
    }
  }, [id]);

  // COD Order
  const paymentHandler = async () => {
    if (!address) {
      toast.error("Please select an address");
      return;
    }

    if (!cart?.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/order/new/cod`,
        {
          method: "COD",
          name: address.name,
          phone: address.phone,
          address: {
            location: address.location,
            city: address.city,
            post: address.post,
            pinCode: address.pinCode,
            district: address.district,
            state: address.state,
            country: address.country,
          }
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      toast.success(
        data?.message || "Order placed successfully"
      );

      await fetchCart();;

      navigate("/order");
    } catch (error) {
      console.error("COD order error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto w-full px-4 py-8 sm:px-6">

      {/* Page Title */}
      <h1 className="mb-3 text-center text-3xl font-bold tracking-tight">
        Proceed To Payment
      </h1>

      <div className="mb-6 border border-gray-400/20 dark:border-blue-900/50" />

      <div className="grid w-full items-start gap-6 lg:grid-cols-3">

        {/* ================= PRODUCTS ================= */}
        <div className="min-w-0 space-y-4 lg:col-span-2">

          {cart?.map((item) => (
            <div
              key={item._id}
              className=" grid  grid-cols-[64px_minmax(0,1fr)] gap-3  rounded-xl  border
                                        border-border/60 bg-orange-50 p-3 shadow shadow-gray-300
                                        transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg
                                        dark:bg-card dark:shadow-fuchsia-100/40 dark:hover:shadow-sm
                                        sm:grid-cols-[80px_minmax(0,1fr)_auto]  sm:items-center sm:gap-4  sm:p-4">

              {/* Image */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
                <img
                  src={
                    item.product?.images?.[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={item.product?.title || "Product"}
                  className=" h-full w-full object-contain transition-transform
                                                duration-300 hover:scale-105"/>
              </div>

              {/* Product Details */}
              <div className="min-w-0 self-center">
                <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {item.product?.title}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {item.quantity} × ₹
                  {item.product?.price}
                </p>

                <p className="font-medium">
                  Total: ₹
                  {item.product?.price * item.quantity}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="min-w-0 lg:sticky lg:top-24">

          {/* Payment Summary */}
          <div className="rounded-xl border border-border bg-green-100
                                    p-5 shadow-sm dark:bg-fuchsia-600/10
                                    dark:shadow-white/20 sm:p-6">

            <h2 className="text-xl font-semibold tracking-tight">
              Payment Summary
            </h2>

            <div className="my-2 border-t border-gray-400 dark:border-white/30" />

            {/* Total Items */}
            <div className="flex justify-between text-sm">
              <span className="text-lg">
                Total Items
              </span>

              <span className="font-medium">
                {totalItem}
              </span>
            </div>

            {/* Subtotal */}
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-lg">
                Subtotal
              </span>

              <span className="font-medium">
                ₹{subTotal}
              </span>
            </div>
          </div>

          {/* Address */}
          <div
            className="
                            mt-3
                            rounded-xl
                            border
                            border-border
                            bg-green-100
                            p-5
                            shadow-sm
                            dark:bg-fuchsia-600/10
                            dark:shadow-white/20
                            sm:p-6
                        "
          >
            <h2 className="text-xl font-semibold tracking-tight">
              Delivery Address
            </h2>

            <div className="my-2 border-t border-gray-400 dark:border-white/30" />

            {address ? (
              <div className="space-y-1 text-sm">
                {/* Name */}
                <p className="text-lg font-semibold">
                  {address.name}
                </p>

                {/* Phone */}
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{address.phone}</span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2">
                  <LocateIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p>{address.location}</p>
                </div>

                {/* City, Post, District, State, Country */}
                <p>
                  {address.city}
                  {address.post && `, ${address.post}`}
                  {address.district && `, ${address.district}`}
                  {address.state && `, ${address.state}`}
                  {address.country && `, ${address.country}`}
                </p>

                {/* PIN */}
                <p className="font-medium">
                  PIN: {address.pinCode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Loading address...
              </p>
            )}

            {/* Payment Method */}
            <div className="mt-5">
              <h3 className="mb-2 font-semibold">
                Payment Method
              </h3>

              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-background p-2 outline-none"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            {/* Continue Button */}
            <Button
              onClick={() => {
                if (method === "ONLINE") {
                  navigate(`/stripe/${id}`);
                  return;
                }

                paymentHandler();
              }}
              disabled={loading || !address}
              className="mt-6 w-full font-medium shadow-sm transition-all hover:bg-orange-400 hover:shadow-md dark:hover:bg-orange-700"
              size="lg"
            >
              {loading ? "Placing Order..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;