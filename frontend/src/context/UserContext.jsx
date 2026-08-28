import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomToaster from "../notifications/CustomToaster";
import { validateEmail } from "@/validation/emailValidation";

const UserContext = createContext();

export const UserProvider = ({ children, server }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);


    // Login user
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

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                btnLoading,
                isAuth,
                loginUser,
            }}
        >
            {children}
            <CustomToaster />
        </UserContext.Provider>
    );
};

// Custom hook for accessing user context
export const UserData = () => useContext(UserContext);