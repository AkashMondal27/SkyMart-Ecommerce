import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserData } from '@/context/UserContext'
import { Loader } from 'lucide-react'
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'



const Login = () => {

  const[email ,setEmail]=useState("");

  const{loginUser, btnLoading}=UserData();
  const navigate=useNavigate();

  const submitHandler=()=>{
    loginUser(email,navigate);
  }

  return (
    <div className='min-h-[50vh] w-full'>
      <Card className="w-[calc(100%-3rem)] max-w-100 mx-auto mt-5">
        <CardHeader>
          <CardTitle> Enter Email to get Otp</CardTitle>
          <CardDescription>
            If you have already got otp on mail then you can go to otp tab
          </CardDescription>
       </CardHeader>

       <CardContent className="space-y-2">
        <div className='space-x-1'>
        <Label> Enter Email</Label> <br/>

        <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>
       </CardContent>

       <CardFooter >
        <Button  disabled={btnLoading}  onClick={submitHandler}>
          {btnLoading ?<Loader/>:"Submit"}
        </Button>
       </CardFooter>
      </Card>
    </div>
  )
}

export default Login
