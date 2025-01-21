'use client'

import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import {User} from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";


const page = () => {
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading,setIsSwitchLoading]=useState(false);
  const {toast}=useToast();

  const handleDeleteMessage=async(messageId:string)=>{
    setMessages(messages.filter((message)=>message.id!==messageId));  
  }

  
  const {data:session}=useSession();

  const form=useForm({
    resolver:zodResolver(acceptMessageSchema),
  })

  const {register,watch,setValue}=form;

  const acceptMessages=watch('acceptMessages');
  const fetchAcceptMessages=useCallback(async()=>{
    setIsSwitchLoading(true);
    try{
      const response=await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue('acceptMessages',response.data.isAcceptingMessages);
    }catch(error){
      const  axiosError=error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || "Error accepting messages",
        variant: 'destructive',
      })
    }finally{
      setIsSwitchLoading(false);
    }
  },[setValue])

  const fetchMessages=useCallback(async(refresh:boolean=false)=>{
    setLoading(true);
    setIsSwitchLoading(false);
    try{
      const response=await axios.get<ApiResponse>(`/api/get-messages`);
      setMessages(response.data.messages || []);
      if(refresh){
        toast({
          title: 'Success',
          description: response.data.message,
          variant: 'destructive',
        })
      }
    }catch(error){
      const  axiosError=error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || "Error accepting messages",
        variant: 'destructive',
      })
    }finally{
      setLoading(false);
      setIsSwitchLoading(false);
    }
  },[setLoading,setMessages])


  // handle switch change
  const handleSwitchChange=async()=>{
    try{
      const response=await axios.post<ApiResponse>(`/api/accept-messages`,{
          acceptMessages: !acceptMessages        
      });

      setValue('acceptMessages',!acceptMessages);
      toast({
        description: response.data.message,
        variant: 'default',
      })
    }catch(error){
      const  axiosError=error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || "Error accepting messages",
        variant: 'destructive',
      })
    }
  }
  useEffect(()=>{
    if(!session|| !session.user) return;
    
    fetchAcceptMessages();
    fetchMessages();
    
  },[setValue,session,fetchAcceptMessages,fetchMessages])
  if(!session || !session.user) return <div>Please login</div>;

  const { name } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${name}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };


  return (
    <div className="w-full max-w-[1180px] mx-auto">
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={`message-${index}`}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    </div>
    
  );
}

export default page
