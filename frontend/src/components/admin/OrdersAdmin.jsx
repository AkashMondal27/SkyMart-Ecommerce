import { server } from '@/main'
import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Input } from '../ui/input'
import Loading from '../Loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Link } from "react-router-dom";
import moment from 'moment/moment'


const OrdersAdmin = () => {

  const [orders, setOrders] = useState([])
  const [Search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {

      const { data } = await axios.get(`${server}/api/v1/order/admin/all`, {
        headers: {
          token: Cookies.get("token")
        }
      })

      // setOrders(data.data); 
      setOrders(Array.isArray(data?.data) ? data.data : []);

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchOrders();
  }, [])


  //search orders by order id or user name or user email
  const filteredOrders = orders.filter((order) => {
    const searchText = Search.toLowerCase().trim();

    const date = order?.createdAt
      ? new Date(order.createdAt)
      : null;

    const dateFormats = date
      ? [
        date.toLocaleDateString("en-IN"),
        date.toLocaleDateString("en-IN").replaceAll("/", "-"),
        date.toISOString().split("T")[0],
      ]
      : [];

    return (
      order?._id?.toLowerCase().includes(searchText) ||
      order?.user?.name?.toLowerCase().includes(searchText) ||
      order?.user?.email?.toLowerCase().includes(searchText) ||
      order?.status?.toLowerCase().includes(searchText) ||
      dateFormats.some((date) =>
        date.toLowerCase().includes(searchText)
      )
    );
  });



  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold"> Manage Orders</h1>

      <Input placeholder="Search by Order ID, User Name or User Email"
        value={Search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full  md:w-1/2" />


      {
        loading ? (
          <Loading />
        ) : (
          filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead> Order Id</TableHead>
                    <TableHead>Account Holder</TableHead>
                    <TableHead>Account Email</TableHead>
                    <TableHead> Total</TableHead>
                    <TableHead> Status</TableHead>
                    <TableHead> Date</TableHead>
                    <TableHead> Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredOrders.map((order) => {
                    const status = order?.status || "Pending" || "pending";


                    const statusStyle =
                      status === "Delivered" || status === "delivered"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : status === "Shipping" || status === "shipping" || status === "Shipped" || status === "shipped"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : status === "Cancelled" || status === "cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";



                    return (
                      <TableRow key={order._id}>
                        <TableCell>
                          <Link to={`/order/${order._id}`}> {order._id} </Link>
                        </TableCell>

                        <TableCell>
                          {order.user.name}
                        </TableCell>

                        <TableCell>
                          {order.user.email}
                        </TableCell>

                        <TableCell>
                          ₹{order.subTotal.toLocaleString("en-IN")}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                          >
                            {status}
                          </span>
                        </TableCell>

                        <TableCell>
                          {moment(order.createdAt).format("DD MMMM YYYY")}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>

              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No orders found.
            </p>
          )
        )
      }

    </div>
  )
}

export default OrdersAdmin
