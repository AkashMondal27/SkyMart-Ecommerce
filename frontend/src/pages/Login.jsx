import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/context/UserContext";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { loginUser, btnLoading } = UserData();
  const navigate = useNavigate();

  const submitHandler = async () => {
    loginUser(name, email, navigate);
  };

  return (
    <div className="min-h-[50vh] w-full">
      <Card className="w-[calc(100%-3rem)] max-w-md mx-auto mt-5">

        <CardHeader>
          <CardTitle>Login to SkyCart</CardTitle>

          <CardDescription>
            Enter your name and email to receive an OTP.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name
            </Label>

            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

        </CardContent>

        <CardFooter>
          <Button
            disabled={btnLoading}
            onClick={submitHandler}
            className="w-full"
          >
            {btnLoading ? (
              <Loader className="animate-spin" />
            ) : (
              "Send OTP"
            )}
          </Button>
        </CardFooter>

      </Card>
    </div>
  );
};

export default Login;