import { Button } from "@base-ui/react";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center
                         px-5 py-12 bg-gray-50 dark:bg-gray-950 ">

            <div className=" w-full max-w-5xl flex flex-col md:flex-row 
                            items-center justify-center gap-8 md:gap-14">
               
                {/* =====================Image Section ==================*/}

                <div className="w-full md:w-1/2 flex items-center justify-center">
                    

                           <img src="/notFound.png" alt="Page not found"
                                 className="relative w-full h-auto max-h-[360px]object-contain"/>
                           
                    
                </div>


                {/*=================== Content Section===================== */}

                <div className="w-full md:w-1/2 text-center md:text-left ">
                 <div className="relative w-full max-w-md rounded-3xl bg-white
                                 dark:bg-gray-900 border border-gray-200
                                  dark:border-gray-800 shadow-sm p-6 sm:p-8">
                        
                        {/* Decorative Circle */}
                        <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full
                                        bg-blue-100 dark:bg-blue-950/40 blur-sm "/>

                    {/* Error Code */}
                    <p className="text-sm font-bold uppercase tracking-[0.25em]
                                 text-blue-600 dark:text-blue-400 mb-3">
                        Error 404
                    </p>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight
                                   text-gray-900 dark:text-white">
                        Page not found
                    </h1>


                    {/* Description */}
                    <p className="mt-4 max-w-md mx-auto md:mx-0 text-sm sm:text-base
                                leading-7 text-gray-600 dark:text-gray-400">                        
                        Sorry, we couldn't find the page you're looking for.
                        It may have been moved, deleted, or the address might
                        be incorrect.
                    </p>


                    {/* Buttons */}
                    <div className="mt-7  flex flex-col sm:flex-row items-center md:items-start 
                                    justify-center md:justify-start gap-3 ">
  
                        {/* Go Home */}
                        <Link to="/">
                            <Button className="h-10 px-5  rounded-lg inline-flex items-center cursor-pointer
                                               justify-centergap-2 gap-2 bg-blue-900 text-white
                                               font-medium  hover:bg-orange-600 dark:bg-blue-600
                                               dark:hover:bg-orange-500 transition-all duration-200">
                                <Home className="w-4 h-4" />
                                Go to Home
                            </Button>
                        </Link>


                        {/* Continue Shopping */}
                        <Link to="/products">
                            <Button
                                variant="outline"
                                className="h-10 px-5 rounded-lg inline-flex items-center justify-center bg-gray-300 dark:bg-gray-700
                                           gap-2 border-gray-500 cursor-pointer dark:border-gray-700 text-gray-700
                                         dark:text-gray-200 hover:bg-orange-300 dark:hover:bg-orange-600 dark:hover:text-white
                                          transition-all duration-200">
 
                                <ShoppingBag className="w-4 h-4" />
                                Browse Products
                            </Button>
                        </Link>

                    </div>


                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className=" mt-5 inline-flex items-center gap-2 text-sm font-medium cursor-pointer  text-red-500
                                     dark:text-red-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
   
                        <ArrowLeft className="w-4 h-4" />
                        Go back to previous page
                    </button>

                </div>
                </div>

            </div>
        </main>
    );
};

export default NotFound;