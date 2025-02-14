'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast, useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import GoogleButton from  'react-google-button'
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
import { signinSchema } from "@/schemas/signinSchema"
import { signIn } from "next-auth/react"
import { Separator } from "@radix-ui/react-separator"


const handleGoogleSignIn = async () => {
  try {
    
    await signIn('google', { 
      callbackUrl:`http://localhost:3000/dashboard` // Specify a clear redirect destination
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    toast({
      title: 'Sign-in Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
  }
};
const SignInpage = () => {
  
  const { toast } = useToast()
  const router=useRouter()

  // zod implementation
  const form=useForm<z.infer<typeof signinSchema>>({
    resolver:zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  })

  const onSubmit=async (data:z.infer<typeof signinSchema>)=>{
    const result=await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
    })
    if(result?.error){
      toast({
        title: 'Sign in failed',
        description: result.error,
        variant: 'destructive',
      })
    }

    if(result?.ok){
      toast({
        title: 'Sign in successful',
        description: 'You can now sign in',
      })
      router.replace('/dashboard');
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
              name="identifier"
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
              <Button type="submit">
                  Sign In
                </Button>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-center">
                <GoogleButton onClick={handleGoogleSignIn}/>
              </div>
          </form>
          </Form>
        </div>
      </div>
    </div>
      
   
    
  )
}

export default SignInpage
