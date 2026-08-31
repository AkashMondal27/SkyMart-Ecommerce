import React from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { ProductData } from "@/context/ProductContext";

const Home = () => {
    const { loading, products, newProd } = ProductData();

    return (
        <main className="w-full">
            <Hero />

            <div className="top products mt-4 px-4">
                <h1 className="text-3xl mb-4">
                    Latest Products
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
                    {newProd && newProd.length > 0 ? (
                        newProd.map((e) => (
                            <ProductCard
                                key={e._id}
                                product={e}
                                latest="yes"
                            />
                        ))
                    ) : (
                        <p>No Products Yet</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Home;