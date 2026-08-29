import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
    FaGithub,
    FaLinkedinIn,
} from "react-icons/fa6";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer
            className="
                mt-12 w-full
                border-t border-zinc-200
                bg-zinc-50 
                dark:border-blue-900/40
                dark:bg-[#080d18]
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                    px-4
                    py-10
                    sm:px-6
                    lg:px-8
                "
            >
                {/* ================= MAIN FOOTER ================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-10
                        sm:grid-cols-2
                        lg:grid-cols-3
                        lg:gap-16
                    "
                >
                    {/* ================= LEFT — BRAND ================= */}

                    <div>
                        <Link
                            to="/"
                            className="
                                inline-block
                                text-2xl
                                font-bold
                                tracking-tight
                            "
                        >
                            <span className="text-blue-500 dark:text-blue-400">
                                Sky
                            </span>

                            <span className="text-zinc-800 dark:text-white">
                                Cart
                            </span>
                        </Link>

                        <p
                            className="
                                mt-3
                                max-w-xs
                                text-sm
                                leading-6
                                text-zinc-500
                                dark:text-zinc-400
                            "
                        >
                            Everything you need, all in one place. Shop
                            quality products with a simple and convenient
                            experience.
                        </p>

                        {/* ================= SOCIAL ICONS ================= */}

                        <div className="mt-5 flex items-center gap-3">

                            {/* Facebook */}

                            <a
                                href="https://www.facebook.com/YOUR_USERNAME"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-full
                                    border border-zinc-200
                                    text-zinc-500
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-blue-500
                                    hover:bg-blue-500
                                    hover:text-white
                                    dark:border-zinc-700
                                    dark:text-zinc-400
                                    dark:hover:border-blue-500
                                    dark:hover:bg-blue-500
                                    dark:hover:text-white
                                "
                            >
                                <FaFacebookF className="h-4 w-4" />
                            </a>

                            {/* Instagram */}

                            <a
                                href="https://www.instagram.com/akash__diaries"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-full
                                    border border-zinc-200
                                    text-zinc-500
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-pink-500
                                    hover:bg-pink-500
                                    hover:text-white
                                    dark:border-zinc-700
                                    dark:text-zinc-400
                                    dark:hover:border-pink-500
                                    dark:hover:bg-pink-500
                                    dark:hover:text-white
                                "
                            >
                                <FaInstagram className="h-4 w-4" />
                            </a>

                            {/* X */}

                            <a
                                href="https://x.com/AkashMonda27"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X (Twitter)"
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-full
                                    border border-zinc-200
                                    text-zinc-500
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-zinc-800
                                    hover:bg-zinc-800
                                    hover:text-white
                                    dark:border-zinc-700
                                    dark:text-zinc-400
                                    dark:hover:border-white
                                    dark:hover:bg-white
                                    dark:hover:text-black
                                "
                            >
                                <FaXTwitter className="h-4 w-4" />
                            </a>

                            {/* GitHub */}

                            <a
                                href="https://github.com/AkashMondal27"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-full
                                    border border-zinc-200
                                    text-zinc-500
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-zinc-800
                                    hover:bg-zinc-800
                                    hover:text-white
                                    dark:border-zinc-700
                                    dark:text-zinc-400
                                    dark:hover:border-white
                                    dark:hover:bg-white
                                    dark:hover:text-black
                                "
                            >
                                <FaGithub className="h-4 w-4" />
                            </a>

                            {/* LinkedIn */}

                            <a
                                href="https://www.linkedin.com/in/akashmondal27/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-full
                                    border border-zinc-200
                                    text-zinc-500
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-blue-600
                                    hover:bg-blue-600
                                    hover:text-white
                                    dark:border-zinc-700
                                    dark:text-zinc-400
                                    dark:hover:border-blue-600
                                    dark:hover:bg-blue-600
                                    dark:hover:text-white
                                "
                            >
                                <FaLinkedinIn className="h-4 w-4" />
                            </a>

                        </div>
                    </div>


                    {/* ================= MIDDLE — COMPANY ================= */}

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wider
                                text-zinc-900
                                dark:text-white
                            "
                        >
                            Company
                        </h3>

                        <ul className="mt-4 space-y-3">

                            <li>
                                <Link
                                    to="/about"
                                    className="
                                        text-sm
                                        text-zinc-500
                                        transition-colors
                                        hover:text-orange-500
                                        dark:text-zinc-400
                                        dark:hover:text-orange-400
                                    "
                                >
                                    About Us
                                </Link>
                            </li>



                            <li>
                                <Link
                                    to="/terms"
                                    className="
                                        text-sm
                                        text-zinc-500
                                        transition-colors
                                        hover:text-orange-500
                                        dark:text-zinc-400
                                        dark:hover:text-orange-400
                                    "
                                >
                                    Terms & Conditions
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/privacy"
                                    className="
                                        text-sm
                                        text-zinc-500
                                        transition-colors
                                        hover:text-orange-500
                                        dark:text-zinc-400
                                        dark:hover:text-orange-400
                                    "
                                >
                                    Privacy Policy
                                </Link>
                            </li>

                        </ul>
                    </div>


                    {/* ================= RIGHT — CONTACT US ================= */}

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wider
                                text-zinc-900
                                dark:text-white
                            "
                        >
                            Contact Us
                        </h3>

                        <div
                            className="
                                mt-4
                                space-y-4
                                text-sm
                                text-zinc-500
                                dark:text-zinc-400
                            "
                        >

                            {/* Location */}

                            <div>


                                <p className="mt-1 leading-6">
                                    Dubrajpur, Birbhum, 731123, West Bengal,India




                                </p>
                            </div>

                            {/* Mobile */}
                            <div>
                                <a
                                    href="tel:8250107704"
                                    className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-zinc-500
            transition-colors
            hover:text-orange-500
            dark:text-zinc-400
            dark:hover:text-orange-400
        "
                                >
                                    <Phone className="h-4 w-4 shrink-0" />

                                    <span>
                                        8250107704
                                    </span>
                                </a>
                            </div>




                            {/* Email */}
                            <div>
                                <a
                                    href="mailto:akashmondal102003@gmail.com"
                                    className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-zinc-500
            transition-colors
            hover:text-orange-500
            dark:text-zinc-400
            dark:hover:text-orange-400
        "
                                >
                                    <Mail className="h-4 w-4 shrink-0" />

                                    <span className="break-all">
                                        akashmondal102003@gmail.com
                                    </span>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>


                {/* ================= BOTTOM FOOTER ================= */}

                <div
                    className="
                        mt-10
                        flex
                        flex-col
                        items-center
                        gap-2
                        border-t
                        border-zinc-200
                        pt-6
                        text-center
                        dark:border-zinc-800
                    "
                >

                    {/* Copyright */}

                    <p
                        className="
                            text-xs
                            text-zinc-500
                            dark:text-zinc-400
                        "
                    >
                        © {new Date().getFullYear()} SkyCart.
                        All rights reserved.
                    </p>


                    {/* Developer */}

                    <p
                        className="
                            text-xs
                            text-zinc-500
                            dark:text-zinc-400
                        "
                    >
                        Built by{" "}
                        <a
                            href="https://www.linkedin.com/in/akashmondal27/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                font-medium
                                text-zinc-700
                                transition-colors
                                hover:text-blue-600
                                dark:text-zinc-200
                                dark:hover:text-blue-400
                            "
                        >
                            Akash Mondal
                        </a>
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;