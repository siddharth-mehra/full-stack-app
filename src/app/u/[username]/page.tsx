'use client'

import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { 
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
  FormLabel,
} from "@/components/ui/form"
import { MessageSchema } from '@/schemas/messageSchema'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const Senderpage = () => {
  const [loading, setLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const params = useParams<{ username: string }>();
  const name = decodeURIComponent(params.username);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        name,
      });
      console.log(response.data.message);
      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const fetchSuggestedMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/suggest-messages');
      const result = parseStringMessages(response.data.questions);
      setSuggestedMessages(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full mx-auto max-w-[1180px] '>
      <div className='flex items-center justify-center flex-col p-8 overflow-hidden'>
        <h1 className='text-4xl font-bold mt-20 lg:mt-8'>Public Profile Link</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{name}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write a message"
                      className='resize-none'
                      {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={loading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="w-full space-y-4 my-8">
          <div className="space-y-2">
            <Button
              onClick={fetchSuggestedMessages}
              className="my-4"
              disabled={loading}
            >
              Suggest Messages
            </Button>
            <p>Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {loading ? (
                <p className="text-red-500">{'Loading...'}</p>
              ) : (
                suggestedMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Senderpage

