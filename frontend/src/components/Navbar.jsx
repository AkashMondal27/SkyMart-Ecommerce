import { Home as HomeIcon, ShoppingBag, LogIn, ShoppingCart, User } from 'lucide-react';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = () => {
        alert("Logged Out")
    }

    const isAuth = true;

    return (
        <div className='z-50 sticky top-0 bg-zinc-200/50   border-b backdrop:blur '>
            {/* <div className='container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between'> */}
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">

                {/*  SkyMart Logo */}
                <h1 className=' text-2xl font-bold '> <span className='text-blue-400'>Sky</span>Mart</h1>

                {/* <ul className=' flex justify-center items-center space-x-6 '> */}
                <ul
                    className="
                fixed bottom-0 left-0 right-0
                md:static
                flex justify-around md:justify-center
                items-center
                space-x-0 md:space-x-6
                backdrop-blur
                border-t md:border-0
                 bg-zinc-200/50 md:bg-transparent 
                py-3 md:py-0
                z-50
                "
                >

                    {/* Home */}
                    <li onClick={() => navigate("/")}
                        className={` w-auto md:w-16 cursor-pointer flex items-center gap-1 transition-colors duration-200
                            ${location.pathname === "/"
                                ? "text-orange-500 font-bold"
                                : "text-gray-700 hover:text-orange-500 font-semibold"
                            } 
                             `}

                    >
                        {/* Mobile */}
                        <HomeIcon className="w-5 h-5 md:hidden " strokeWidth={location.pathname === "/" ? 3 : 2} />

                        {/* Medium & Large */}
                        <span className="hidden md:inline">
                            Home
                        </span>
                    </li>



                    {/* Products */}
                    <li
                        onClick={() => navigate("/products")}
                        className={`w-auto md:w-24 cursor-pointer flex items-center gap-1 transition-colors duration-200
                            ${location.pathname === "/products"
                                ? "text-orange-500 font-bold"
                                : "text-gray-700 hover:text-orange-500 font-semibold"
                            }`}
                    >
                        <ShoppingBag className="w-5 h-5 md:hidden " strokeWidth={location.pathname === "/products" ? 3 : 2} />
                        <span className="hidden md:inline">Products</span>
                    </li>


                    {/* Cart */}
                    <li
                        onClick={() => navigate("/cart")}
                        className={`w-auto md:w-12 cursor-pointer relative flex items-center transition-colors duration-200
                            ${location.pathname === "/cart"
                                ? "text-orange-500 font-bold"
                                : "text-gray-700 hover:text-orange-500 font-semibold"
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" strokeWidth={location.pathname === "/cart" ? 3 : 2} />

                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            5
                        </span>
                    </li>



                    <li className='cursor-pointer'>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md cursor-pointer transition-colors duration-200  hover:text-orange-500 hover:bg-orange-50"
                            >
                                {isAuth ? <User className="h-5 w-5 cursor-pointer" /> : <LogIn className="h-6 w-6 cursor-pointer" />}
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuGroup>

                                    <DropdownMenuLabel>
                                        Account
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    {!isAuth ? (
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/login")}>
                                            Login
                                        </DropdownMenuItem>
                                    ) : (
                                        <>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/order")}>
                                                Your Order
                                            </DropdownMenuItem>

                                            <DropdownMenuItem className="cursor-pointer" onClick={logoutHandler}>
                                                Logout
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuGroup>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar
