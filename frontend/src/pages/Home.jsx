import React from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { ProductData } from "@/context/ProductContext";
import { Link } from "react-router-dom";

const Home = () => {
    const { loading, products, newProd } = ProductData();

    return (
        <main className="w-full mb-6">
            <Hero />

            <div className="top products mt-4 px-4">
                <h1 className="text-3xl font-bold mb-4">
                    Latest Products
                </h1>
                

                <div className=" md:px-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">

                    {newProd && newProd.length > 0 ? (
                        newProd.map((e) => (
                            <ProductCard
                                key={e._id}
                                product={e}
                                latest="yes"
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">

                            <h2 className="text-2xl font-bold mb-2">
                                Sorry! There's Nothing New Right Now.
                            </h2>

                            <p className="text-muted-foreground mb-6 max-w-md">
                                We don't have any new products to show at the moment.
                                Check out our complete collection to find something you like.
                            </p>

                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                Check Out All Products
                            </Link>

                        </div>
                    )}

                </div>
            </div>
        </main>
    );
};

export default Home;