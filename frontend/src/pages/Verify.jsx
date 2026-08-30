import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserData } from '@/context/UserContext'
import { Loader, ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'



const Verify = () => {

    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const { btnLoading, loginUser, verifyUser, } = UserData();

    // Verify the entered OTP and complete the login process.
    const submitHandler = () => {
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        verifyUser(name, email, otp, navigate);
    };

    // Start a 90-second countdown before allowing the user to resend OTP.
    const [timer, setTimer] = useState(90);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1)
            }, 1000);

            return () => clearInterval(interval);  // Clean up the timer when it is no longer needed.

        } else {
            setCanResend(true)
        }
    }, [timer]);


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

    }

    const handleResendOtp = async () => {
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email")
        await loginUser(name, email, navigate);
        setTimer(90);
        setCanResend(false);


    }
    return (
        <div className='min-h-[50vh] w-full'>
            {/* Back to login so user can correct name or email */}
            <div className="w-[calc(100%-3rem)] max-w-100 mx-auto mt-5">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                        localStorage.removeItem("name");
                        localStorage.removeItem("email");
                        navigate("/login");
                    }}
                    className="mb-2   dark:hover:bg-white/10 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Button>
            </div>

            <Card className="w-[calc(100%-3rem)] max-w-100 mx-auto mt-5">
                <CardHeader>
                    <CardTitle> Verify User OTP</CardTitle>
                    <CardDescription>
                        Enter the OTP sent to your email. If you don't see it,
                        please check your spam or junk folder.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                    <div className='space-x-1'>
                        <Label> Enter OTP</Label> <br />
                       
                        <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter 6 digit OTP"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        />

                    </div>
                </CardContent>

                <CardFooter >
                    <Button disabled={btnLoading} onClick={submitHandler}>
                        {btnLoading ? <Loader /> : "Submit"}
                    </Button>
                </CardFooter>

                <div className='flex flex-col justify-center items-center w-50 m-auto '>
                    < p className=' mb-2'>
                        {canResend ? "You can now Resend OTP" :
                            `Time remaing :${formatTime(timer)}`
                        }
                    </p>
                    <Button onClick={handleResendOtp}
                        className="mb-4 " disabled={!canResend}>Resend OTP</Button>
                </div>
            </Card>
        </div>
    )
}

export default Verify;
