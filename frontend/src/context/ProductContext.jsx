import { server } from "@/main";
import axios from "axios";
import {  createContext, useContext, useEffect, useState } from "react";

const ProductContext=createContext();

export const ProductProvider=({children})=>{

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProd, setNewProd] = useState([]);

    const fetchProducta=async()=>{
            setLoading(true);
        try {
            const {data}=await axios.get(`${server}/api/v1/products/all`);

            console.log("PRODUCT API RESPONSE:", data);
            
            setProducts(data.products);
            setNewProd(data.newProducts)
        } catch (error) {
            console.log("PRODUCT ERROR:",error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchProducta();
    },[])
     
    return <ProductContext.Provider value={{loading, products, newProd}}>
        {children}
    </ProductContext.Provider>
}

export const ProductData=()=>useContext(ProductContext)