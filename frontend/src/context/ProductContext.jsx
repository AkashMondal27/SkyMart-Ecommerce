import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

    // All products
    const [products, setProducts] = useState([]);

    // Loading state
    const [loading, setLoading] = useState(true);

    // Latest 4 products
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


    // Fetch products
    const fetchProducts = async () => {

        setLoading(true);

        try {

            const { data } = await axios.get(
                `${server}/api/v1/products/all?search=${search}&category=${category}&sortByPrice=${price}&page=${page}`
            );

            console.log("PRODUCT API RESPONSE:", data);


            // Products
            setProducts(data.products || []);


            // Latest 4 products
            setNewProd(data.newProducts || []);


            // Categories
            setCategories(data.categories || []);


            // Total pages
            setTotalPages(data.totalPages || 1);

        } catch (error) {

            console.log(
                "PRODUCT ERROR:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }
    };


    // Fetch products whenever search, category, price or page changes
    useEffect(() => {

        fetchProducts();

    }, [search, category, price, page]);


    return (
        <ProductContext.Provider
            value={{
                loading,
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

                totalPages
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};


// Custom hook
export const ProductData = () => useContext(ProductContext);