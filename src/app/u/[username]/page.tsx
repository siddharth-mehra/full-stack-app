'use client'

import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

const page = () => {
  const [loading, setLoading] = React.useState(false);
  const params=useParams();
  const [form,setform]=useState('');
  console.log(params);

  

  return (
    <div className='w-full mx-auto max-w-[1180px] overflow-hidden'>
      <div className='flex items-center justify-center flex-col'>
          
            <h1 className='text-4xl font-bold m-8'>Public Profile Link</h1>
            <div className='w-full'>
              <div>
                {`Send Anonymous Message to @${params.name}`}
              </div>
            
              <div>
                <Button>
                  Send it
                </Button>
              </div>
          </div>
      </div>
    </div>
  )
}

export default page
