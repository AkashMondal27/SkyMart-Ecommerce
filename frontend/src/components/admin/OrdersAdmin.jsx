import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Loading from "../Loading";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Search,
  RefreshCw,
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  CalendarDays,
  User,
  Mail,
  IndianRupee,
} from "lucide-react";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const fetchOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data } = await axios.get(
        `${server}/api/v1/order/admin/all`,
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      const { data } = await axios.post(
        `${server}/api/v1/order/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      toast.success(data?.message || "Order status updated");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Error updating order status:",
        error?.response?.data || error?.message
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return orders;
    }

    return orders.filter((order) => {
      const date = order?.createdAt
        ? new Date(order.createdAt)
        : null;

      const dateFormats = date
        ? [
            date.toLocaleDateString("en-IN"),
            date.toLocaleDateString("en-IN").replaceAll("/", "-"),
            date.toISOString().split("T")[0],
            moment(date).format("DD MMMM YYYY"),
            moment(date).format("DD MMM YYYY"),
          ]
        : [];

      return (
        order?._id?.toLowerCase().includes(searchText) ||
        order?.user?.name?.toLowerCase().includes(searchText) ||
        order?.user?.email?.toLowerCase().includes(searchText) ||
        order?.status?.toLowerCase().includes(searchText) ||
        dateFormats.some((dateValue) =>
          dateValue.toLowerCase().includes(searchText)
        )
      );
    });
  }, [orders, search]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(
        (order) => order?.status?.toLowerCase() === "pending"
      ).length,
      shipping: orders.filter(
        (order) =>
          order?.status?.toLowerCase() === "shipping" ||
          order?.status?.toLowerCase() === "shipped"
      ).length,
      delivered: orders.filter(
        (order) => order?.status?.toLowerCase() === "delivered"
      ).length,
      cancelled: orders.filter(
        (order) => order?.status?.toLowerCase() === "cancelled"
      ).length,
    };
  }, [orders]);

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "delivered":
        return {
          badge:
            "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
          icon: CheckCircle2,
        };

      case "shipping":
      case "shipped":
        return {
          badge:
            "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20",
          icon: Truck,
        };

      case "cancelled":
        return {
          badge:
            "bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20",
          icon: XCircle,
        };

      default:
        return {
          badge:
            "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
          icon: Clock3,
        };
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    iconClass,
  }) => (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const currentStatus = status || "Pending";
    const { badge, icon: StatusIcon } =
      getStatusStyle(currentStatus);

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}
      >
        <StatusIcon className="h-3.5 w-3.5" />
        {currentStatus}
      </span>
    );
  };

 
 const StatusSelect = ({ order }) => {
  const status = order?.status || "Pending";
  const isUpdating = updatingOrder === order._id;

  return (
    <Select
      value={status}
      onValueChange={(value) => updateOrderStatus(order._id, value)}
      disabled={isUpdating}
    >
      <SelectTrigger className="h-9 w-[130px] border-border/70 bg-background text-xs font-medium">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Processing">Processing</SelectItem>
        <SelectItem value="Shipped">Shipped</SelectItem>
        <SelectItem value="Delivered">Delivered</SelectItem>
        <SelectItem value="Cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

  return (
    <div className="min-h-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Manage Orders
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Monitor orders, customer details and delivery status.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          Refresh Orders
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={ShoppingBag}
          description="All orders"
          iconClass="bg-primary/10 text-primary"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock3}
          description="Waiting for processing"
          iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <StatCard
          title="Shipping"
          value={stats.shipping}
          icon={Truck}
          description="Currently shipping"
          iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={CheckCircle2}
          description="Successfully delivered"
          iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          description="Cancelled orders"
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
        />
      </div>

      {/* Search */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by order ID, customer, email, status or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 pr-4"
          />
        </div>

        {search && (
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="font-medium text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : filteredOrders.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm lg:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="whitespace-nowrap font-semibold">
                      Order
                    </TableHead>

                    <TableHead className="whitespace-nowrap font-semibold">
                      Customer
                    </TableHead>

                    <TableHead className="whitespace-nowrap font-semibold">
                      Total
                    </TableHead>

                    <TableHead className="whitespace-nowrap font-semibold">
                      Status
                    </TableHead>

                    <TableHead className="whitespace-nowrap font-semibold">
                      Date
                    </TableHead>

                    <TableHead className="whitespace-nowrap text-right font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow
                      key={order._id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* Order */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Link
                            to={`/order/${order._id}`}
                            className="w-fit font-semibold text-primary hover:underline"
                          >
                            #{order._id?.slice(-8)}
                          </Link>

                          <span className="text-xs text-muted-foreground">
                            ID: {order._id}
                          </span>
                        </div>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="flex min-w-[190px] flex-col gap-1.5">
                          <div className="flex items-center gap-2 font-medium">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            {order?.user?.name || "N/A"}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="max-w-[210px] truncate">
                              {order?.user?.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Total */}
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold whitespace-nowrap">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          {Number(order?.subTotal || 0).toLocaleString(
                            "en-IN"
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={order?.status} />
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />

                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {order?.createdAt
                                ? moment(order.createdAt).format(
                                    "DD MMM YYYY"
                                  )
                                : "N/A"}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {order?.createdAt
                                ? moment(order.createdAt).format(
                                    "hh:mm A"
                                  )
                                : ""}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                          >
                            <Link to={`/order/${order._id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">
                                View order
                              </span>
                            </Link>
                          </Button>

                          <StatusSelect order={order} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/order/${order._id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      #{order._id?.slice(-8)}
                    </Link>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {order?.createdAt
                        ? moment(order.createdAt).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <StatusBadge status={order?.status} />
                </div>

                <div className="my-4 border-t border-border/60" />

                {/* Customer */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />

                    <span className="truncate text-sm font-medium">
                      {order?.user?.name || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />

                    <span className="truncate text-sm text-muted-foreground">
                      {order?.user?.email || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="my-4 border-t border-border/60" />

                {/* Bottom */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Order Total
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-lg font-bold">
                      <IndianRupee className="h-4 w-4" />
                      {Number(order?.subTotal || 0).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  {/* <div className="flex items-center gap-2"> */}
                  <div className="flex w-full items-center gap-2 sm:w-auto">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-9 flex-1 sm:w-[100px] sm:flex-none"
                      // className="flex-1 sm:flex-none"
                    >
                      <Link to={`/order/${order._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>

                    {/* <div className="flex-1 sm:flex-none"> */}
                    <div className="flex-1 sm:w-[130px] sm:flex-none">
                      <StatusSelect order={order} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-base font-semibold">
            No orders found
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {search
              ? "No orders match your search. Try another order ID, customer name, email or date."
              : "There are no orders available yet."}
          </p>

          {search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearch("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;