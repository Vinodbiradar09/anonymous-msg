"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { X, Trash2, Clock, MessageSquare } from "lucide-react";
import axios, { AxiosError } from "axios";
import { Message } from "@/model/User";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from "dayjs";
import { Button } from "./ui/button";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  if (!message._id) {
    console.log("messageId", message._id);
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      if (response.data.success) {
        toast.success(response.data.message || "Message deleted successfully");
        onMessageDelete(message._id);
      } else {
        toast.error(response.data.message || "Failed to delete message");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Delete error:", error);
      toast.error(
        axiosError.response?.data.message || "Failed to delete message"
      );
    }
  };

  return (
    <Card className="bg-black/60 backdrop-blur-sm border-gray-800/50 shadow-lg shadow-black/20 hover:bg-black/70 hover:border-gray-700/60 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-gray-700/40 rounded-full p-2 flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-gray-200 text-base leading-relaxed font-medium break-words">
                  {message.content}
                </CardTitle>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
              </span>
            </div>
          </div>

        
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-800/40 hover:bg-red-900/40 border border-gray-700/40 hover:border-red-700/60 text-gray-400 hover:text-red-400 transition-all duration-200 opacity-70 group-hover:opacity-100 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

          
            <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-gray-800/60 shadow-2xl shadow-black/50">
              <AlertDialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-900/30 rounded-full p-2">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <AlertDialogTitle className="text-gray-200 text-lg">
                    Delete Message?
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-gray-400 leading-relaxed">
                  This action cannot be undone. This will permanently delete
                  this anonymous message from your account.
                </AlertDialogDescription>

              
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 mt-4">
                  <p className="text-gray-300 text-sm italic">
                    &ldquo;{message.content}&rdquo;
                  </p>
                </div>
              </AlertDialogHeader>

              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel className="bg-gray-800/60 hover:bg-gray-700/60 border-gray-700/60 text-gray-300 hover:text-gray-200 transition-colors">
                  Keep Message
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-900/60 hover:bg-red-800/60 border-red-800/60 text-red-200 hover:text-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

    
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="bg-gray-800/40 px-2 py-1 rounded-md">
              Anonymous
            </span>
          </div>
          <div className="text-right">
            <span>{dayjs(message.createdAt).format("MMM D, YYYY")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
