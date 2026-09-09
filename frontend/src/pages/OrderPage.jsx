

import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    ArrowLeft,
    Download,
    Printer,
    ShoppingBag,
} from "lucide-react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

const OrderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);

    const invoiceRef = useRef(null);

    // =========================
    // FETCH ORDER
    // =========================
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(
                    `${server}/api/v1/order/${id}`,
                    {
                        headers: {
                            token: Cookies.get("token"),
                        },
                    }
                );

                setOrder(data.data);
            } catch (error) {
                console.log("Order fetch error:", error);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [id]);

    // =========================
    // PRINT
    // =========================
    const handlePrint = () => {
        window.print();
    };

    // =========================
    // DOWNLOAD PDF
    // =========================
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
        setPdfLoading(true);

        const element = invoiceRef.current;

        const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            cacheBust: true,
        });

        const img = new Image();
        img.src = dataUrl;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pageWidth = 210;
        const pageHeight = 297;

        const margin = 8;

        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;

        const ratio = img.width / img.height;

        let width = availableWidth;
        let height = width / ratio;

        // Fit into ONE A4 page
        if (height > availableHeight) {
            height = availableHeight;
            width = height * ratio;
        }

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(
            dataUrl,
            "PNG",
            x,
            y,
            width,
            height
        );

        const fileName =
            order?.invoiceNumber ||
            `INV-${order?._id?.slice(-8).toUpperCase()}`;

        pdf.save(`${fileName}.pdf`);

    } catch (error) {
        console.error("PDF download failed:", error);
        alert("Unable to create PDF. Please try again.");
    } finally {
        setPdfLoading(false);
    }
};

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return <Loading />;
    }

    // =========================
    // ORDER NOT FOUND
    // =========================
    if (!order) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                        <ShoppingBag
                            className="h-12 w-12 text-gray-500"
                            strokeWidth={1.5}
                        />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Order Not Found
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-6 text-gray-500">
                        We couldn't find any order associated with this
                        order ID. Please check the order ID and try again.
                    </p>

                    <Button
                        onClick={() => navigate("/order")}
                        className="mt-7 w-full sm:w-auto"
                    >
                        View My Orders
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    // =========================
    // DATA
    // =========================

    const customerName =
        order.name ||
        order.user?.name ||
        "Customer";

    const customerEmail =
        order.email ||
        order.user?.email ||
        "—";

    const customerPhone =
        order.phone ||
        order.user?.phone ||
        "—";

    const invoiceNumber =
        order.invoiceNumber ||
        `INV-${order._id?.slice(-8).toUpperCase()}`;

    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "—";

    const paymentDate = order.paidAt
        ? new Date(order.paidAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : null;

    // =========================
    // ADDRESS
    // =========================

    const formatAddress = (address) => {
        if (!address) return "—";

        if (typeof address === "string") {
            return address;
        }

        if (typeof address === "object") {
            return [
                address.address,
                address.street,
                address.location,
                address.city,
                address.district,
                address.state,
                address.pin || address.zipCode,
                address.country,
            ]
                .filter(Boolean)
                .join(", ");
        }

        return "—";
    };

    const billingAddress = formatAddress(order.address);

    // =========================
    // PRODUCTS
    // =========================

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    const getProductName = (item) => {
        return (
            item.product?.name ||
            item.product?.title ||
            item.name ||
            "Product"
        );
    };

    const getQuantity = (item) => {
        return Number(item.quantity || item.qty || 1);
    };

    const getPrice = (item) => {
        return Number(
            item.price ??
                item.product?.price ??
                item.product?.sellingPrice ??
                0
        );
    };

    const getItemTotal = (item) => {
        return getPrice(item) * getQuantity(item);
    };

    const subtotal =
        Number(order.subTotal ?? order.subtotal ?? 0);

    const shipping = 0;

    const total = subtotal + shipping;

    // =========================
    // PAYMENT
    // =========================

    const paymentMethod =
        order.method === "Online"
            ? "Online Payment"
            : "Cash on Delivery";

    const paymentStatus =
        order.paymentStatus || "Pending";

    const orderStatus =
        order.status || "Pending";

    const isPaid =
        paymentStatus.toLowerCase() === "paid";

    return (
        <><style>
    {`
        @media print {

            @page {
                size: A4 portrait;
                margin: 0;
            }

            html,
            body {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }

            body * {
                visibility: hidden !important;
            }

            #order-invoice,
            #order-invoice * {
                visibility: visible !important;
            }

            #order-invoice {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;

                width: 210mm !important;

                margin: 0 !important;
                padding: 8mm !important;

                border: none !important;
                border-radius: 0 !important;
                box-shadow: none !important;

                background: white !important;
                color: #111827 !important;
            }

            #order-invoice table {
                width: 100% !important;
                table-layout: fixed !important;
            }

            #order-invoice th,
            #order-invoice td {
                overflow: hidden !important;
                word-break: break-word !important;
            }

            #order-invoice tr {
                page-break-inside: avoid !important;
            }

            .print-hidden {
                display: none !important;
            }
        }
    `}
</style>


            <div className="min-h-screen bg-muted/30 py-6 sm:py-10 px-3 sm:px-6">
            <div className="print-hidden mx-auto  w-full max-w-4xl">
    <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="gap-2 px-2"
    >
        <ArrowLeft className="h-4 w-4" />
        Go Back
    </Button>
</div>
             
                {/* =========================
                    ACTION BUTTONS
                ========================= */}

                <div className="print-hidden mx-auto mb-4 flex w-full max-w-4xl justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            Print
                        </span>
                    </Button>

                    <Button
                        onClick={handleDownloadPDF}
                        disabled={pdfLoading}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {pdfLoading
                            ? "Creating PDF..."
                            : "Download PDF"}
                    </Button>
                </div>

                {/* =========================
                    SINGLE INVOICE PAGE
                ========================= */}

                <div
                    ref={invoiceRef}
                    id="order-invoice"
                    className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm [color-scheme:light]"
                >
                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="border-b border-gray-200 px-5 py-4 sm:px-8 sm:py-5">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    <span className='text-blue-400'>Sky</span><span className='text-orange-400'>Cart</span>

                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    Dubrajpur, Birbhum, West Bengal
                                </p>

                                <p className="text-sm text-gray-500">
                                    India - 731123
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    Phone: +91 8250107704
                                </p>

                                <p className="text-sm text-gray-500 break-all">
                                    Email: akashmondal102003@gmail.com
                                </p>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-sm font-medium text-gray-500">
                                    INVOICE
                                </p>

                                <p className="mt-1 text-lg font-semibold">
                                    {invoiceNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        ORDER CONFIRMED
                    ========================= */}

                    <div className="border-b border-gray-200 px-5 py-4 sm:px-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${
                                            isPaid
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                        }`}
                                    />

                                    <h2 className="text-lg font-bold tracking-tight">
                                        {isPaid
                                            ? "ORDER CONFIRMED"
                                            : "ORDER PLACED"}
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    Thank you for shopping with
                                    <span className='text-blue-400'>Sky</span><span className='text-orange-400'>Cart</span>
                                </p>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Order Status
                                </p>

                                <p className="mt-1 font-semibold">
                                    {orderStatus}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Order ID
                                </p>

                                <p className="mt-1 break-all text-sm font-medium">
                                    {order._id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Invoice
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {invoiceNumber}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Order Date
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {orderDate}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                    Payment
                                </p>

                                <p
                                    className={`mt-1 text-sm font-semibold ${
                                        isPaid
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }`}
                                >
                                    {isPaid
                                        ? "PAID"
                                        : paymentStatus.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        BILL TO
                    ========================= */}

                    <div className="border-b border-gray-200 px-5 py-4 sm:px-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider">
                            Bill To
                        </h2>

                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Customer Name
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {customerName}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Email
                                </p>

                                <p className="mt-1 break-all text-sm font-medium">
                                    {customerEmail}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {customerPhone}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Billing Address
                                </p>

                                <p className="mt-1 text-sm font-medium leading-6">
                                    {billingAddress}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        ORDER ITEMS
                    ========================= */}

                    <div className="border-b border-gray-200 px-5 py-4 sm:px-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider">
                            Order Items
                        </h2>

                        {/* Desktop table */}
                        <div className="mt-5 hidden overflow-x-auto sm:block">
                            <table className="w-full table-fixed border-collapse">
    <thead>
        <tr className="border-y border-gray-200 text-left">

            <th className="w-[55%] px-2 py-2 text-xs font-semibold uppercase text-gray-500">
                Product
            </th>

            <th className="w-[10%] px-2 py-2 text-center text-xs font-semibold uppercase text-gray-500">
                Qty
            </th>

            <th className="w-[17.5%] px-2 py-2 text-right text-xs font-semibold uppercase text-gray-500">
                Price
            </th>

            <th className="w-[17.5%] px-2 py-2 text-right text-xs font-semibold uppercase text-gray-500">
                Total
            </th>

        </tr>
    </thead>

    <tbody>
        {items.map((item, index) => (
            <tr
                key={
                    item._id ||
                    item.product?._id ||
                    index
                }
                className="border-b border-gray-100 last:border-b-0"
            >

                <td className="break-words px-2 py-2 text-sm font-medium">
                    {getProductName(item)}
                </td>

                <td className="px-2 py-2 text-center text-sm">
                    {getQuantity(item)}
                </td>

                <td className="px-2 py-2 text-right text-sm">
                    ₹
                    {getPrice(item).toLocaleString("en-IN")}
                </td>

                <td className="px-2 py-2 text-right text-sm font-semibold">
                    ₹
                    {getItemTotal(item).toLocaleString("en-IN")}
                </td>

            </tr>
        ))}
    </tbody>
</table>
                        </div>

                        {/* Mobile items */}
                        <div className="mt-5 space-y-4 sm:hidden">
                            {items.map((item, index) => (
                                <div
                                    key={
                                        item._id ||
                                        item.product?._id ||
                                        index
                                    }
                                    className="border-b pb-4 last:border-b-0"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold">
                                                {getProductName(
                                                    item
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Qty:{" "}
                                                {getQuantity(item)}
                                                {" × "}
                                                ₹
                                                {getPrice(
                                                    item
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-sm font-semibold">
                                            ₹
                                            {getItemTotal(
                                                item
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {items.length === 0 && (
                            <p className="py-6 text-center text-sm text-gray-500">
                                No products found in this order.
                            </p>
                        )}
                    </div>

                    {/* =========================
                        TOTALS
                    ========================= */}

                    <div className="border-b border-gray-200 px-5 py-4 sm:px-8">
                        <div className="ml-auto w-full max-w-sm space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span className="font-medium">
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    Shipping
                                </span>

                                <span className="font-medium">
                                    FREE
                                </span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-bold">
                                        TOTAL
                                    </span>

                                    <span className="text-xl font-bold">
                                        ₹
                                        {total.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        PAYMENT
                    ========================= */}

                    <div className="border-b border-gray-200 px-5 py-4 sm:px-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider">
                            Payment
                        </h2>

                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Method
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {paymentMethod}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Status
                                </p>

                                <p
                                    className={`mt-1 text-sm font-semibold ${
                                        isPaid
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }`}
                                >
                                    {paymentStatus}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Paid On
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {paymentDate || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-xs text-gray-500">
                                Order Status
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {orderStatus}
                            </p>
                        </div>
                    </div>

                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="px-5 py-7 text-center sm:px-8">
                        <p className="text-sm font-semibold">
                            Thank you for shopping with {" "} <span className='text-blue-400'> Sky</span><span className='text-orange-400'>Cart</span>
                        </p>

                        <div className="mt-5 space-y-1 text-xs text-gray-500">
                            <p className="font-semibold text-gray-900">
                                <span className='text-blue-400'>Sky</span><span className='text-orange-400'>Cart</span>
                            </p>

                            <p>
                                Dubrajpur, Birbhum, West Bengal,
                                India - 731123
                            </p>

                            <p>+91 8250107704</p>

                            <p className="break-all">
                                akashmondal102003@gmail.com
                            </p>

                            <p>GSTIN: XXXXXXXX</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;




// import { server } from "@/main";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import Loading from "@/components/Loading";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, ShoppingBag } from "lucide-react";
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// const OrderPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchOrder = async () => {
//             try {
//                 const { data } = await axios.get(
//                     `${server}/api/v1/order/${id}`,
//                     {
//                         headers: {
//                             token: Cookies.get("token"),
//                         },
//                     }
//                 );

//                 setOrder(data.data);
//             } catch (error) {
//                 console.log(error);
//                 setOrder(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchOrder();
//         }
//     }, [id]);

//     if (loading) {
//         return <Loading />;
//     }

//     // No order with this ID
//     if (!order) {
//         return (
//             <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
//                 <div className="w-full max-w-lg text-center">

//                     <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
//                         <ShoppingBag
//                             className="h-12 w-12 text-gray-500"
//                             strokeWidth={1.5}
//                         />
//                     </div>

//                     <h1 className="text-2xl sm:text-3xl font-bold">
//                         Order Not Found
//                     </h1>

//                     <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-6 text-gray-500">
//                         We couldn't find any order associated with this
//                         order ID. Please check the order ID and try again.
//                     </p>

//                     <Button
//                         onClick={() => navigate("/order")}
//                         className="mt-7 w-full sm:w-auto"
//                     >
//                         View My Orders
//                         <ArrowRight className="ml-2 h-4 w-4" />
//                     </Button>

//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto py-6 px-4">
//             <Card className={ "mb-6"}>
//                 <CardHeader>
//                     <div className=" flex justify-between">
//                     <CardTitle className="text-2xl font-bold"> Order Details</CardTitle>
//                     <Button onClick={()=>window.print()}>Print Order</Button>
//                     </div>
//                 </CardHeader>

//                 <div className="grid grid-col-1 lg:grid-cols-2 gap-6">
//                     <div>
//                         <h2 className=" text-xl font-semibold mb-4">
//                                Order Summary 
//                         </h2>

//                         {/* want to show order status , order */}
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default OrderPage;