import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { UserData } from "@/context/UserContext";


const Verify = () => {
    const navigate = useNavigate();

    const { btnLoading } = UserData();

    const [otp, setOtp] = useState("");

    // Get the email saved during login
    const email = localStorage.getItem("email");

    // Handle OTP verification
    const handleVerify = async (e) => {
        e.preventDefault();

        if (!otp) {
            return;
        }

        try {
            const { data } = await axios.post(
                `${server}/api/v1/users/verify`,
                {
                    email,
                    otp,
                }
            );

            console.log(data);

            // After successful verification
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">
                            Verify Your Email
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter the OTP sent to
                        </p>

                        <p className="font-medium">
                            {email}
                        </p>
                    </div>

                    {/* Verification form */}
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label
                                htmlFor="otp"
                                className="mb-2 block text-sm font-medium"
                            >
                                Enter OTP
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                placeholder="Enter 6-digit OTP"
                                className="w-full rounded-md border bg-background px-3 py-2 text-center text-lg tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Verify button */}
                        <button
                            type="submit"
                            disabled={btnLoading || otp.length !== 6}
                            className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {btnLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                    </form>

                    {/* Back to login */}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Verify;