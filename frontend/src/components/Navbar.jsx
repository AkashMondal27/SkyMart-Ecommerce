import { LogIn, ShoppingCart, User } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const Navbar = () => {

    const navigate = useNavigate();

    const logoutHandler = () => {
        alert("Logged Out")
    }

    const isAuth = true;

    return (
        <div className='z-50 sticky top-0 bg-background/50 border-b backdrop:blur'>
            <div className=' container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between'>
                <h1 className=' text-2xl font-bold'> SkyMart</h1>
                <ul className=' flex justify-center items-center space-x-6 '>
                    <li className=' cursor-pointer' onClick={() => navigate("/")}>
                        Home
                    </li>

                    <li className=' cursor-pointer' onClick={() => navigate("/products")}>
                        Products
                    </li>

                    <li className=' cursor-pointer relative flex items-center' onClick={() => navigate("/cart")}>
                        <ShoppingCart className='w-6 h-6' />
                        <span className=' absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold
                        w-5 h-5 flex items-center justify-center rounded-full'>
                            5
                        </span>
                    </li>

                    <li className='cursor-pointer'>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md cursor-pointer hover:bg-muted"
                            >
                                {isAuth ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuGroup>

                                    <DropdownMenuLabel>
                                        Account
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    {!isAuth ? (
                                        <DropdownMenuItem onClick={() => navigate("/login")}>
                                            Login
                                        </DropdownMenuItem>
                                    ) : (
                                        <>
                                            <DropdownMenuItem onClick={() => navigate("/order")}>
                                                Your Order
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={logoutHandler}>
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
