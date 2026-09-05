import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
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

    const loginUser = async (name ,email, navigate) => {

        // Validate name
      if (!name || name.trim() === "") {
        toast.error("Name is required");
        return;
      }

       const cleanName = name.trim();

        //  Validate email first in Frontend 
        const validation = validateEmail(email);

        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        const cleanEmail = validation.email;

        setBtnLoading(true);

        // make a 15 seconds loading effect 
        let seconds = 15;

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
                { 
                    name: cleanName,
                    email: cleanEmail, 
                }
            );

            clearInterval(countdown);

            toast.success(data.message, {
                id: toastId,
            });

            // Store name & email temporarily for verification & Go to verification page
            localStorage.setItem("name", cleanName);
            localStorage.setItem("email", cleanEmail);
            navigate("/verify");

        } catch (error) {
            clearInterval(countdown);
            toast.error(
                error.response?.data?.message || "Something went wrong", 
                {
                id: toastId,
                }
            );
        } finally {

            setBtnLoading(false); // Stop button loading
        }
    };




    //=================== Verify User ==========================

    const verifyUser = async (name,email, otp, navigate,fetchCart) => {

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
                    name,
                    email,
                    otp: validation.otp,
                }
            );

            toast.success(data.message);

            // 3. Remove temporary name & email
            localStorage.removeItem("name");
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

            // 6. Fetch user's cart
             await fetchCart();

            // 7. Go to home page
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

    //========= User Profile Fetch =========================
    
      
  const fetchUser = async () => {
     const token = Cookies.get("token");

      console.log("TOKEN:", token);
      console.log("SERVER:", server);

      try {
        const { data } = await axios.get(
            `${server}/api/v1/users/me`,
            {
                headers: {
                    token: token,
                },
            }
         );

         console.log("USER DATA:", data);

         setIsAuth(true);
        //  setUser(data.user);
        setUser(data.data); // ✅ FIX
         setLoading(false);
        } catch (error) {
          console.log("ME ERROR:", error.response?.data);
          console.log("STATUS:", error.response?.status);

          setIsAuth(false);
          setLoading(false);
        }
};

     //==================== LogOut User========================
    const logoutUser = async (navigate, fetchCart) => {
        Cookies.remove("token");

        setUser(null);
        setIsAuth(false);

        toast.success("Logged out successfully");

        fetchCart();

        navigate("/login");
    };
   

useEffect(() => {
    fetchUser();
}, [server]);

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                btnLoading,
                isAuth,
                loginUser,
                verifyUser,
                logoutUser

            }}
        >
            {children}
            <CustomToaster />
        </UserContext.Provider>
    );

};

// Custom hook for accessing user context
export const UserData = () => useContext(UserContext);