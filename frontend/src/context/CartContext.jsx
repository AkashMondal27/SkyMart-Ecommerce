import axios from "axios";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { server } from "@/main";

const CartContext = createContext(null);



export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {

        // Get the latest token every time
        const token = Cookies.get("token");

        // User is not logged in
        if (!token) {
            setCart([]);
            setTotalItem(0);
            setSubTotal(0);
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(
                `${server}/api/v1/cart/all`,
                {
                    headers: {
                        token,
                    },
                }
            );

            // ApiResponse stores the actual cart data inside data.data
            const cartData = data?.data;

            setCart(cartData?.cart || []);
            setTotalItem(cartData?.sumOfQuantities || 0);
            setSubTotal(cartData?.subTotal || 0);

        } catch (error) {
            console.error(
                "Fetch cart error:",
                error?.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };


    /* ===============================================
                    Add Product To Cart
    =======================================================*/

    const addToCart = async (productId) => {
        const token = Cookies.get("token");

        // Require authentication
        if (!token) {
            toast.error("Please login to add products to your cart");
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${server}/api/v1/cart/add`,
                {
                    product: productId,
                },
                {
                    headers: {
                        token,
                    },
                }
            );

            // Show success message
            toast.success(
                data?.message || "Product added to cart successfully"
            );

            // Refresh cart data
            await fetchCart();

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Unable to add product to cart"
            );

            console.error(
                "Add to cart error:",
                error?.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };



    /* ===============================================
                  Update Cart Product
  =======================================================*/

    const updateCart = async (action, id) => {
        const token = Cookies.get("token");

        // Require authentication
        if (!token) {
            toast.error("Please login to update your cart");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(`${server}/api/v1/cart/update?action=${action}`,
                { id },
                {
                    headers: {
                        token,
                    }
                }
            )


            toast.success(
                data?.message ||
                "Cart updated successfully"
            );

            // Get latest cart data
            await fetchCart();


        } catch (error) {
            console.error(
                "Update cart error:",
                error?.response?.data || error?.message
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to update cart"
            );
        } finally {
            setLoading(false);
        }
    };


    /* ===============================================
                  Remove  Product from car
    =======================================================*/
    const removeFromCart = async (id) => {
    const token = Cookies.get("token");

    if (!token) {
        toast.error("Please login to manage your cart");
        return;
    }

    try {
        setLoading(true);

        const { data } = await axios.get(
            `${server}/api/v1/cart/remove/${id}`,
            {
                headers: {
                    token,
                },
            }
        );

        toast.success(
            data?.message || "Product removed from cart"
        );

        await fetchCart();
    } catch (error) {
        console.error(
            "Remove product error:",
            error?.response?.data || error?.message
        );

        toast.error(
            error?.response?.data?.message ||
                "Unable to remove product from cart"
        );
    } finally {
        setLoading(false);
    }
};
    


    // Fetch Cart On Authentication
    useEffect(() => {
        fetchCart();
    }, []);


    const cartValue = {
        cart,
        totalItem,
        subTotal,
        loading,
        fetchCart,
        addToCart,
        setTotalItem,
        updateCart,
        removeFromCart,
    };

    return (
        <CartContext.Provider value={cartValue}>
            {children}
        </CartContext.Provider>
    );
};

export const CartData = () => {
    return useContext(CartContext);
};