'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const {toast}=useToast();
    const handleDeleteConfirm = async() => {
        const response=await axios.delete<ApiResponse>(`/api/delete-message/${message.id}`);
        console.log(response)
        toast({
            title: 'Message deleted successfully',
            description: response.data.message,
        })
        onMessageDelete(message.id);
    }
  return (
    <div>
      <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <p>{message.content}</p>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive"><X className="w-5 h-5"/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </div>
  )
}

export default MessageCard
