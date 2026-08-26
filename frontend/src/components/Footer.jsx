import React from 'react'
import { Link } from "react-router-dom";

const Footer = () => {
    return (

        <footer className='w-full mt-8'>
            <hr className='border-gray-300 dark:border-gray-700' />
            <div className='container mx-auto px-4 py-6'>
                <div className=' flex flex-col md:flex-row justify-between items-center'>
                    <div className='mb-6 flex flex-col md:flex-row justify-between items-center'>
                        <h1 className=' text-xl font-bold'>SkyMart</h1> 
                        <p className=' text-sm '>Everything you need , all in one place .</p>
                    </div>

                    <div className=' flex flex-wrap justify-center md:justify-end gap-4'>
                        <Link to="#" className="text-sm hover:underline">
                            About Us
                        </Link>

                        <Link to="#" className="text-sm hover:underline">
                            Contact Us
                        </Link>

                        <Link to="#" className="text-sm hover:underline">
                            Term and Condition
                        </Link>
                    </div>
                </div>

                {/* ADD social Links */}
                <div className='mt-6 text-center'>
                    <p className='text-sm'>Follow us: </p>
                    <div className='flex justify-center gap-4 mt-2'>
                        <a href='#' className=' hover:opacity-75'>
                            facebook
                        </a>
                        
                    </div>
                </div>
            
            </div>
        </footer>

    )
}

export default Footer
