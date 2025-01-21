'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  
  const {data:session} =useSession();
  const user:User=session?.user
  return (
   
        <nav className='w-full max-w-[1180px] mx-auto p-4 z-[50]'>
        <div className="flex items-center justify-center">
            <a href="/">
                {
                    session?(
                        <>
                        <span className='mr-8 font-bold text-lg'>
                            Welcome, {user?.name || user.email}
                        </span>
                        <Button onClick={() => signOut()}
                            className='w-full md:w-auto'>
                            Logout
                        </Button>
                        </>
                    ):(
                        <>
                        
                            <Button className='w-full md:w-auto'>
                                Sign In
                            </Button>
                        
                        </>
                    )
                }
            </a>
        </div>
    </nav>
    
    
  )
}

export default Navbar
