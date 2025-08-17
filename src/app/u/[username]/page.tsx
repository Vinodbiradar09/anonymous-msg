"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Loader2, 
  RefreshCw, 
  MessageCircle, 
  Send, 
  Sparkles, 
  User, 
  ArrowRight,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "sonner";

const specialChar = "||";
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).filter((msg) => msg.trim().length > 0);
};
const initialMessageString =
  "What's Your Go To Food and Place?||Do You Watch StandUp , Who's your Fav?||Have You Ever Tried Dirtypanty Drink?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [suggestedMessages, setSuggestedMessages] = useState<string>(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const messageContent = form.watch("content");
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username: username,
      });
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestedMessages("");
    try {
      const response = await axios.post<{ suggestions: string }>("/api/suggest-messages");
      setSuggestedMessages(response.data.suggestions);
    } catch (error) {
      toast.error("Failed to generate message suggestions");
      setSuggestedMessages(initialMessageString);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
     
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/5 via-black to-gray-800/5"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-gray-700/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gray-600/15 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
       
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-gray-700/20 to-black/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/30 shadow-lg shadow-black/30">
              <MessageCircle className="w-10 h-10 text-gray-300" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Send Anonymous Message
              </span>
            </h1>
            
            <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-4 inline-block">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 text-lg">
                  To: <span className="font-mono text-white font-semibold">@{username}</span>
                </span>
              </div>
            </div>
          </div>

         
          <div className="bg-black/60 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/30 mb-12">
        
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-medium text-lg flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Your Anonymous Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here... Be respectful and creative!"
                          className="resize-none min-h-[150px] bg-gray-800/60 border-gray-700/60 text-white rounded-2xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60 text-lg p-6"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-500 text-sm">
                          Share your thoughts anonymously and safely
                        </p>
                        <p className="text-gray-500 text-sm">
                          {messageContent?.length || 0} characters
                        </p>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-center">
                  {isLoading ? (
                    <Button 
                      disabled
                      className="bg-gray-700/50 text-gray-400 px-8 py-4 rounded-xl cursor-not-allowed"
                    >
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Message...
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isLoading || !messageContent}
                      className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-700/50"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Anonymous Message
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>

         
          <div className="bg-black/60 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/30">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-gray-700/20 to-black/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700/30 shadow-lg shadow-black/30">
                <Bot className="w-8 h-8 text-gray-300" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  AI-Powered Suggestions
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-6">
                Let our AI help you craft the perfect anonymous message
              </p>

              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 border border-gray-700/50"
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI is thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate New Suggestions
                    <RefreshCw className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Click on any suggestion below to use it as your message
              </p>
            </div>

           
            <Card className="bg-gray-800/40 border-gray-700/40 shadow-lg shadow-black/20">
              <CardHeader className="pb-4">
                <h3 className="text-xl font-semibold text-gray-200 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-gray-400" />
                  Creative Message Ideas
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                {isSuggestLoading ? (
                  <div className="flex flex-col items-center justify-center p-12">
                    <div className="bg-gray-700/30 rounded-full p-6 mb-6">
                      <Bot className="w-12 h-12 text-gray-400 animate-pulse" />
                    </div>
                    <Loader2 className="mr-2 h-8 w-8 animate-spin text-gray-400 mb-4" />
                    <span className="text-gray-400 text-lg">AI is crafting creative questions...</span>
                    <p className="text-gray-500 text-sm mt-2">This might take a few seconds</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {parseStringMessages(suggestedMessages).map((message, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="bg-gray-900/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50 text-left p-6 h-auto transition-all duration-200 group"
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex items-start w-full">
                          <div className="bg-gray-700/40 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gray-600/40 transition-colors">
                            <span className="text-gray-300 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-200 text-base leading-relaxed block">
                              {message.trim()}
                            </span>
                            <p className="text-gray-500 text-sm mt-2">
                              Click to use this suggestion
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4 group-hover:text-gray-400 transition-colors" />
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-gray-800/50 my-12" />

        
          <div className="text-center">
            <div className="bg-black/60 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/30">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Want Your Own Message Board?
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Create your own anonymous message board and start receiving honest feedback from your audience
              </p>
              
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700/50">
                  <User className="w-5 h-5 mr-2" />
                  Create Your Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
