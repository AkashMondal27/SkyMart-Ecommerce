import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingBag,
  CreditCard,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Clock3,
  Banknote,
  TrendingUp,
} from "lucide-react";

const PAYMENT_COLORS = ["#06b6d4", "#a855f7"];
const STATUS_COLORS = ["#f59e0b", "#8b5cf6", "#3b82f6", "#22c55e", "#ef4444"];

const InfoAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from existing APIs
  const fetchDashboard = async () => {
    try {
      const token = Cookies.get("token");

      const [statsResponse, ordersResponse] = await Promise.all([
        axios.get(`${server}/api/v1/stats`, {
          headers: { token },
        }),
        axios.get(`${server}/api/v1/order/admin/all`, {
          headers: { token },
        }),
      ]);

      const stats = statsResponse?.data?.data;
      const allOrders = ordersResponse?.data?.data;

      setProducts(
        Array.isArray(stats?.products) ? stats.products : []
      );

      setOrders(Array.isArray(allOrders) ? allOrders : []);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error?.response?.data || error?.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Main order numbers
  const orderStats = useMemo(() => {
    const getStatusCount = (status) =>
      orders.filter(
        (order) =>
          order?.status?.toLowerCase() === status.toLowerCase()
      ).length;

    return {
      total: orders.length,
      pending:
        getStatusCount("Pending") +
        getStatusCount("Pending Payment"),
      processing: getStatusCount("Processing"),
      shipped: getStatusCount("Shipped"),
      delivered: getStatusCount("Delivered"),
      cancelled: getStatusCount("Cancelled"),
    };
  }, [orders]);

  // Payment method numbers
  const paymentStats = useMemo(() => {
    const cod = orders.filter(
      (order) => order?.method?.toLowerCase() === "cod"
    ).length;

    const online = orders.filter(
      (order) => order?.method?.toLowerCase() === "online"
    ).length;

    return { cod, online, total: cod + online };
  }, [orders]);

  const paymentData = [
    {
      name: "Online",
      value: paymentStats.online,
    },
    {
      name: "COD",
      value: paymentStats.cod,
    },
  ];

  const statusData = [
    {
      name: "Pending",
      value: orderStats.pending,
    },
    {
      name: "Processing",
      value: orderStats.processing,
    },
    {
      name: "Shipped",
      value: orderStats.shipped,
    },
    {
      name: "Delivered",
      value: orderStats.delivered,
    },
    {
      name: "Cancelled",
      value: orderStats.cancelled,
    },
  ];

  // Products ranked by units sold
  const productData = useMemo(() => {
    return [...products]
      .map((product) => ({
        name: product?.name || "Unknown Product",
        sold: Number(product?.sold) || 0,
      }))
      .sort((a, b) => b.sold - a.sold);
  }, [products]);

  const onlinePercentage = paymentStats.total
    ? ((paymentStats.online / paymentStats.total) * 100).toFixed(1)
    : 0;

  const codPercentage = paymentStats.total
    ? ((paymentStats.cod / paymentStats.total) * 100).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-[430px] animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8 bg-white dark:bg-black">
      

      {/* Order summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Orders
              </p>

              <p className="mt-1 text-2xl font-bold">
                {orderStats.total}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                All orders
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Processing
              </p>

              <p className="mt-1 text-2xl font-bold">
                {orderStats.processing}
              </p>

              <p className="mt-1 text-xs text-violet-500">
                Being prepared
              </p>
            </div>

            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
              <PackageCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Shipped
              </p>

              <p className="mt-1 text-2xl font-bold">
                {orderStats.shipped}
              </p>

              <p className="mt-1 text-xs text-blue-500">
                On the way
              </p>
            </div>

            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
              <Truck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Delivered
              </p>

              <p className="mt-1 text-2xl font-bold">
                {orderStats.delivered}
              </p>

              <p className="mt-1 text-xs text-emerald-500">
                Successfully delivered
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Orders
              </p>

              <p className="mt-1 text-2xl font-bold">
                {orderStats.pending}
              </p>

              <p className="mt-1 text-xs text-amber-500">
                Awaiting action
              </p>
            </div>

            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
              <Clock3 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Online Payments
              </p>

              <p className="mt-1 text-2xl font-bold">
                {paymentStats.online}
              </p>

              <p className="mt-1 text-xs text-cyan-500">
                {onlinePercentage}% of orders
              </p>
            </div>

            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-500">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Cash on Delivery
              </p>

              <p className="mt-1 text-2xl font-bold">
                {paymentStats.cod}
              </p>

              <p className="mt-1 text-xs text-purple-500">
                {codPercentage}% of orders
              </p>
            </div>

            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
              <Banknote className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Cancelled
              </p>

              <p className="mt-1 text-2xl font-bold">
                {orderStats.cancelled}
              </p>

              <p className="mt-1 text-xs text-red-500">
                Cancelled orders
              </p>
            </div>

            <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment + order status charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution of online and cash-on-delivery orders
            </CardDescription>
          </CardHeader>

          <CardContent>
            {paymentStats.total > 0 ? (
              <div className="relative h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius="55%"
                      outerRadius="75%"
                      paddingAngle={4}
                      strokeWidth={3}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={PAYMENT_COLORS[index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [
                        `${value} orders`,
                        name,
                      ]}
                    />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                    />

                    <text
                      x="50%"
                      y="44%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-3xl font-bold"
                    >
                      {paymentStats.total}
                    </text>

                    <text
                      x="50%"
                      y="52%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-muted-foreground text-xs"
                    >
                      Orders
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
                No payment data available.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              Current distribution of all order statuses
            </CardDescription>
          </CardHeader>

          <CardContent>
            {orderStats.total > 0 ? (
              <div className="relative h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius="50%"
                      outerRadius="72%"
                      paddingAngle={3}
                      strokeWidth={3}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[index]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [
                        `${value} orders`,
                        name,
                      ]}
                    />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                    />

                    <text
                      x="50%"
                      y="44%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-3xl font-bold"
                    >
                      {orderStats.total}
                    </text>

                    <text
                      x="50%"
                      y="52%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-muted-foreground text-xs"
                    >
                      Orders
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
                No order data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product sales */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Product Sales Performance</CardTitle>
              <CardDescription>
                Products ranked by total units sold
              </CardDescription>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {productData.length > 0 ? (
            <div className="h-[430px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 80,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    height={90}
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />

                  <Tooltip
                    cursor={{ opacity: 0.08 }}
                    formatter={(value) => [
                      `${value} units`,
                      "Sold",
                    ]}
                  />

                  <Bar
                    dataKey="sold"
                    name="Units Sold"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                    label={{
                      position: "top",
                      fontSize: 11,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[350px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
              No product sales data available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoAdmin;

