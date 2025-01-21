'use client'

import { useToast } from '@/hooks/use-toast';
import { VerifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const page = () => {
  const router=useRouter();
  const param=useParams<{name:string}>();
  const {toast}=useToast();

  const form=useForm<z.infer<typeof VerifySchema>>({
    resolver:zodResolver(VerifySchema),
  });

  const onSubmit=async(data:z.infer<typeof VerifySchema>)=>{
    try{
      const response=await axios.post('/api/verify-code',{
        name:param.name,
        code:data.code
      });
      toast({
        title: 'Verification successful',
        description: response.data.message,
      })
      router.replace('/sign-in');
    }catch(error){
      
            const axiosError=error as AxiosError<ApiResponse>;
            toast({
              title: 'Sign in failed',
              description: axiosError.response?.data.message ?? "Error signing in",
              variant: 'destructive',
            })
            console.log(axiosError.response?.data.message);
    }
  }
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input placeholder="code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
        </div>
      </div>
    </div>  
  )
}

export default page
