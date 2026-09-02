import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    // All Products
    const [products, setProducts] = useState([]);

    // Loading
    const [loading, setLoading] = useState(true);

    // Latest Products
    const [newProd, setNewProd] = useState([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");

    // Categories
    const [categories, setCategories] = useState([]);

    // Single Product
    const [product, setProduct] = useState(null);
    const [relatedProduct, setRelatedProduct] = useState([]);

    // Error
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

            // All products
            setProducts(data?.products || []);

            // Latest products
            setNewProd(data?.newProducts || []);

            // Categories
            setCategories(data?.categories || []);

            // Pagination
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

            // Single product
            setProduct(data?.product || null);

            // Related products
            setRelatedProduct(data?.relatedProducts || []);
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
            setRelatedProduct([]);
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
                // Loading
                loading,

                // Error
                error,

                // Products
                products,
                newProd,

                // Search
                search,
                setSearch,

                // Categories
                categories,
                category,
                setCategory,

                // Price
                price,
                setPrice,

                // Pagination
                page,
                setPage,
                totalPages,

                // Single Product
                fetchProduct,
                product,
                relatedProduct,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

// =====================================================
// Custom Hook
// =====================================================
export const ProductData = () => useContext(ProductContext);