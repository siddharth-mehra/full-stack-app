'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { User} from 'next-auth'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'


const Navbar = () => {
    const pathname=usePathname();
  const {data:session} =useSession();
  const user:User=session?.user
  console.log(user)
  const [login,setlogin]=useState(false);

  useEffect(() => {
    if(pathname===`/dashboard`){ 
        setlogin(true);
    }else{
        setlogin(false);
    }},[pathname])


  return (
   
    <nav className='w-full p-4 fixed z-[50] '>
        <div className='mx-auto max-w-[1180px]'>
            <div className="flex flex-col md:flex-row  lg:flex-row items-center justify-between gap-x-4">
                <a href="/" className="text-xl font-bold  md:mb-0">
                    Ai FeedBack
                </a>
                {
                    session?(
                        <>
                        <span className='mr-8 font-bold text-lg'>
                            Welcome, {user?.name || user.email}
                        </span>
                        <div>
                        <Button onClick={() => signOut()}
                            className='w-full md:w-auto mr-4'>
                            Logout
                        </Button>
                        {
                        login && (
                            <Link href={`/u/${user.name}`}>
                                <Button>
                                    Sender
                                 </Button>   
                            </Link>
                        )
                        }
                        
                        </div>
                        </>
                    ):(  
                        <Link href="/sign-up">
                            <Button className='w-full md:w-auto'>
                                Sign Up
                            </Button>
                        </Link>
                    )
                }
            
            </div>   
        </div>       
    </nav>
    
    
  )
}

export default Navbar
