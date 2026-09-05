import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProd, setNewProd] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setrelatedProducts] = useState([]);
    const [error, setError] = useState(null);

    /*=====================================================
                 Fetch All Products
     ===================================================== */
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(
                `${server}/api/v1/products/all`,
                {
                    params: {
                        search,
                        category,
                        sortByPrice: price,
                        page,
                    },
                }
            );

            console.log("PRODUCT API RESPONSE:", data);

            setProducts(data?.products || []);
            setNewProd(data?.newProducts || []);
            setCategories(data?.categories || []);
            setTotalPages(data?.totalPages || 1);

        } catch (error) {
            console.error(
                "PRODUCTS ERROR:",
                error?.response?.data || error?.message
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load products. Please try again."
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
             Fetch Single Product
      =====================================================*/

    const fetchProduct = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(
                `${server}/api/v1/products/${id}`
            );

            console.log("SINGLE PRODUCT API RESPONSE:", data);

            setProduct(data?.product || null);
            setrelatedProducts(data?.relatedProducts || []);

        } catch (error) {
            console.error(
                "SINGLE PRODUCT ERROR:",
                error?.response?.data || error?.message
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load this product."
            );

            setProduct(null);
            setrelatedProducts([]);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       Fetch Products When Filters / Page Change
     =====================================================*/
    useEffect(() => {
        fetchProducts();
    }, [search, category, price, page]);



    // Context Provider
    return (
        <ProductContext.Provider
            value={{
                loading,
                error,
                products,
                newProd,
                search,
                setSearch,
                categories,
                category,
                setCategory,
                price,
                setPrice,
                page,
                setPage,
                totalPages,
                fetchProduct,
                product,
                relatedProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

/*=====================================================
         Custom Hook
===================================================== */
export const ProductData = () => useContext(ProductContext);