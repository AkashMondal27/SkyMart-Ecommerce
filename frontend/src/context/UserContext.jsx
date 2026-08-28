import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import CustomToaster from "../notifications/CustomToaster";
import { validateEmail } from "@/validation/emailValidation";
import { validateOtp } from "@/validation/otpValidation";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children, server }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);


    //==================== Login User========================

    const loginUser = async (email, navigate) => {

        // 1. Validate email first in Frontend 
        const validation = validateEmail(email);

    if (!validation.valid) {
        toast.error(validation.message);
        return;
    }

    const cleanEmail = validation.email;

        setBtnLoading(true);

        // make a 10 seconds loading effect 

        let seconds = 10;

        const toastId = toast.loading(`Sending OTP... ${seconds}s`);

        // Countdown
        const countdown = setInterval(() => {
            seconds--;

            if (seconds > 0) {
                toast.loading(`Sending OTP... ${seconds}s`, {
                    id: toastId,
                });
            }
        }, 1000);

        try {
            // Send login request to backend
            const { data } = await axios.post(
                `${server}/api/v1/users/login`,
                { email:cleanEmail, }
            );


            clearInterval(countdown);

            toast.success(data.message, {
                id: toastId,
            });

            // Store email for verification & Go to verification page
            localStorage.setItem("email", cleanEmail);
            navigate("/verify");
        } catch (error) {
            clearInterval(countdown);
            toast.error(
                error.response?.data?.message || "Something went wrong",{
                    id: toastId,
                }
            );
        } finally {

            setBtnLoading(false); // Stop button loading
        }
    };


   

//=================== Verify User ==========================

const verifyUser = async (email, otp, navigate) => {

    // 1. Validate OTP in frontend
    const validation = validateOtp(otp);

    if (!validation.valid) {
        toast.error(validation.message);
        return;
    }

    setBtnLoading(true);
    

    try {

        // 2. Send email + OTP to backend
        const { data } = await axios.post(
            `${server}/api/v1/users/verify`,
            {
                email,
                otp: validation.otp,
            }
        );

        toast.success(data.message);

        // 3. Remove temporary email
        localStorage.removeItem("email");

        // 4. Save authentication state
        setIsAuth(true);
        setUser(data.data?.user);

        // 5. Store JWT
        Cookies.set("token", data.data?.token, {
            expires: 15,
            secure: true,
            sameSite: "strict",
            path: "/",
        });

        // 6. Go to home page
        navigate("/");

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Something went wrong"
        );

    } finally {

        setBtnLoading(false);
    }
};


    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                btnLoading,
                isAuth,
                loginUser,
                verifyUser

            }}
        >
            {children}
            <CustomToaster />
        </UserContext.Provider>
    );
};

// Custom hook for accessing user context
export const UserData = () => useContext(UserContext);