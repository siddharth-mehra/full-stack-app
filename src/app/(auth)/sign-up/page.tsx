'use client'

import useDebounce from "@/app/useDebounce"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema"
import axios,{ AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { 
        Form,
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage,
        FormDescription,
      } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const page = () => {
  const [name,setName]=useState('');
  const [nameMessage,setNameMessage]=useState('');
  const [loading,setloading]=useState(false);
  const[isSubmit,setIsSubmit]=useState(false);
  
  const debouncedName=useDebounce(name,500)
  const { toast } = useToast()
  const router=useRouter()

  // zod implementation
  const form=useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  })

  const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmit(true);
    try{
      console.log(data);
      const response=await axios.post<ApiResponse>('/api/sign-up',data);
      toast({
        title: 'Sign up successful',
        description: 'You can now sign in',
      })
      router.replace(`/verify/${data.name}`);
    }catch(error){
      console.log(error);
      const axiosError=error as AxiosError<ApiResponse>;
      let ErrorMessage=axiosError.response?.data.message ?? "Error signing up";
      toast({
        title: 'Sign up failed',
        description: ErrorMessage,
        variant: 'destructive',
      })
    }finally{
      setIsSubmit(false);
    }
  }
  useEffect(() => {
    const checkusernameUnique=async()=>{
      if(debouncedName){
        setloading(true);
        setNameMessage('');
        try{
          const response=await axios.get(`/api/check-username-unique?name=${debouncedName}`);
          console.log(response.data);
          setNameMessage(response.data.message);
        }catch(error){
          const axiosError=error as AxiosError<ApiResponse>;
          setNameMessage(axiosError.response?.data.message ?? "Error checking username");
        }finally{
          setloading(false);
        }
      }
    }
    checkusernameUnique();
  },[debouncedName])

  return (
    <div className="w-full max-w-[1180px] mx-auto ">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded-lg
        shadow-md dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight 
            lg:text-5xl mb-6">
              Join Mystry Message 
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} 
                  onChange={(e)=>{
                    field.onChange(e)
                    setName(e.target.value)
                  }}/>
                </FormControl>
                {
                  loading && (
                      <Loader2 className="animate-spin" />
                  )
                }
                <p className={`text-sm ${nameMessage==='Username is available' ? 'text-green-500' : 'text-red-500'}`}>
                  {nameMessage}
                </p>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormDescription>
                  Write your email
                </FormDescription>
                <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Your password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
              )}/>    
              <div className="flex justify-center items-center">
              <Button type="submit" disabled={isSubmit}>
                  {
                    isSubmit ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    </>)
                    :('Signup')
                  }
                </Button>
              </div>
          </form>
          </Form>
          <div className="text-center mt-4">
                  <p>
                    Already have an account?{' '}
                    <Link href="/sign-in">
                      Sign in
                    </Link>
                  </p>
          </div>
        </div>
      </div>
    </div>
      
   
    
  )
}

export default page
