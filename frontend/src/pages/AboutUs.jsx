import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ShieldCheck, Truck, Heart } from "lucide-react";

const AboutUs = () => {
    return (
        <div className="container mx-auto   px-4  py-10">
            <div className="max-w-3xl mx-auto space-y-8">

                <div>
                    <h1 className="text-3xl font-bold">SkyCart</h1>
                    <p className="text-muted-foreground mt-2">
                        Your simple and reliable online shopping destination.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Who We Are</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>
                            SkyCart is an online shopping platform designed to
                            make everyday shopping simple, convenient, and
                            accessible.
                        </p>

                        <p>
                            We bring a variety of products together in one
                            place, allowing customers to discover products,
                            compare their options, and place orders with ease.
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardContent className="pt-6">
                            <ShoppingBag className="mb-3 h-6 w-6 text-orange-500" />
                            <h3 className="font-semibold">Wide Selection</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Discover a growing range of products in one
                                convenient place.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <ShieldCheck className="mb-3 h-6 w-6 text-orange-500" />
                            <h3 className="font-semibold">Secure Shopping</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                We aim to provide a safe and reliable shopping
                                experience.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <Truck className="mb-3 h-6 w-6 text-orange-500" />
                            <h3 className="font-semibold">Easy Delivery</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Convenient delivery options for your orders.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <Heart className="mb-3 h-6 w-6 text-orange-500" />
                            <h3 className="font-semibold">Customer First</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Customer satisfaction is at the heart of
                                SkyCart.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                    </CardHeader>

                    <CardContent className="text-muted-foreground">
                        <p>
                            Our mission is to create a dependable online
                            shopping experience where customers can easily
                            find what they need and shop with confidence.
                        </p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default AboutUs;