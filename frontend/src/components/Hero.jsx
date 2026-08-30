import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section
            className="relative w-full h-[calc(100vh-100px)] bg-cover bg-center"
            style={{
                backgroundImage:
                    'linear-gradient(rgba(0,0,0,0.32), rgba(0,0,0,0.32)), url("/bg image2.jpg")',
            }}
        >
            {/* Hero Content */}
            <div className="flex items-center justify-center h-full px-5 text-center text-white">
                <div className="max-w-3xl">

                    {/* Small Label */}
                    <p className="mb-4 text-sm sm:text-base font-semibold tracking-[0.25em] uppercase text-orange-300">
                        Shop Smart. Live Better.
                    </p>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
                        Everything You Love,
                        <br />
                        <span className="text-orange-400">
                            All in One Place.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-xl lg:text-2xl leading-relaxed text-white/90 mb-9 max-w-2xl mx-auto">
                        Discover quality products, great deals, and everyday
                        essentials — carefully selected for you.
                    </p>

                    {/* CTA Button */}
                    <Button
                        size="lg"
                        onClick={() => navigate("/products")}
                        className="
                            group bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-6  rounded-xl
                            shadow-xl transition-all duration-300 hover:scale-105 ">
                                   Explore Products
                        <ArrowRight
                            className="
                                ml-2 h-5 w-5 transition-transform duration-300  group-hover:translate-x-1"/>
                    </Button>

                </div>
            </div>
        </section>
    );
};

export default Hero;