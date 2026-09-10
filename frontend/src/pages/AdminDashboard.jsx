


import HomeAdmin from "@/components/admin/HomeAdmin";
import InfoAdmin from "@/components/admin/InfoAdmin";
import OrdersAdmin from "@/components/admin/OrdersAdmin";

import { Button } from "@/components/ui/button";
import { UserData } from "@/context/UserContext";

import {
    Home,
    ShoppingBag,
    Info,
    SlidersHorizontal,
    X,
} from "lucide-react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [selectedPage, setSelectedPage] = useState("home");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    //Only admid can Acess / see this page 
    const navigate=useNavigate();
    const{user}=UserData()
    if(user.role !=="admin")return navigate("/");


    const handlePageChange = (page) => {
        setSelectedPage(page);
        setSidebarOpen(false);
    };

    const renderPageContent = () => {
        switch (selectedPage) {
            case "home":
                return <HomeAdmin />;

            case "orders":
                return <OrdersAdmin />;

            case "info":
                return <InfoAdmin />;

            default:
                return <HomeAdmin />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">

            

            {/* ================= ADMIN HEADER ================= */}
            <header className=" top-16 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-background/95">

                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* LEFT - ADMIN DASHBOARD */}
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                       <span className=" text-green-500 text-3xl"> Admin </span> 
                        <span className="text-blue-900 dark:text-blue-500">Dashboard</span>
                    </h1>

                    {/* ================= DESKTOP / TABLET ================= */}
                    <div className="hidden items-center gap-2 sm:flex">

                        {/* HOME */}
                        <Button
                            variant="ghost"
                            onClick={() => handlePageChange("home")}
                            className={`gap-2 ${
                                selectedPage === "home"
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Button>

                        {/* ORDERS */}
                        <Button
                            variant="ghost"
                            onClick={() => handlePageChange("orders")}
                            className={`gap-2 ${
                                selectedPage === "orders"
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span>Orders</span>
                        </Button>

                        {/* INFORMATION */}
                        <Button
                            variant="ghost"
                            onClick={() => handlePageChange("info")}
                            className={`gap-2 ${
                                selectedPage === "info"
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            <Info className="h-4 w-4" />
                            <span>Information</span>
                        </Button>

                    </div>

                    {/* ================= MOBILE FILTER ================= */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSidebarOpen(true)}
                        className="gap-2 sm:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                    </Button>

                </div>
            </header>

            {/* ================= MOBILE OVERLAY ================= */}
            {sidebarOpen && (
                <div
                    className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/40 backdrop-blur-sm sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ================= MOBILE SIDEBAR ================= */}
            <aside
                className={`fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-background sm:hidden ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                }`}
            >

                {/* SIDEBAR HEADER */}
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-white/10">

                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Admin Menu
                        </h2>

                        <p className="text-xs text-muted-foreground">
                            Select a section
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                </div>

                {/* SIDEBAR BUTTONS */}
                <nav className="space-y-2 p-4">

                    {/* HOME */}
                    <Button
                        variant="ghost"
                        onClick={() => handlePageChange("home")}
                        className={`w-full justify-start gap-3 ${
                            selectedPage === "home"
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                    </Button>

                    {/* ORDERS */}
                    <Button
                        variant="ghost"
                        onClick={() => handlePageChange("orders")}
                        className={`w-full justify-start gap-3 ${
                            selectedPage === "orders"
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        <ShoppingBag className="h-5 w-5" />
                        <span>Orders</span>
                    </Button>

                    {/* INFORMATION */}
                    <Button
                        variant="ghost"
                        onClick={() => handlePageChange("info")}
                        className={`w-full justify-start gap-3 ${
                            selectedPage === "info"
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        <Info className="h-5 w-5" />
                        <span>Information</span>
                    </Button>

                </nav>
            </aside>

            {/* ================= PAGE CONTENT ================= */}
            <main className="mx-auto w-full max-w-7xl  px-4 pt-2 pb-4 sm:px-6 lg:px-8">
                {renderPageContent()}
            </main>

        </div>
    );
};

export default AdminDashboard;


