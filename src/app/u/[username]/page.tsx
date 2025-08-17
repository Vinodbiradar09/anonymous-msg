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
  Bot,
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
  return messageString
    .split(specialChar)
    .filter((msg) => msg.trim().length > 0);
};
const initialMessageString =
  "What's Your Go To Food and Place?||Do You Watch StandUp , Who's your Fav?||Have You Ever Tried Dirtypanty Drink?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [suggestedMessages, setSuggestedMessages] =
    useState<string>(initialMessageString);
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
      const response = await axios.post<{ suggestions: string }>(
        "/api/suggest-messages"
      );
      setSuggestedMessages(response.data.suggestions);
    } catch (error) {
      toast.error("Failed to generate message suggestions");
      setSuggestedMessages(initialMessageString);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
    
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/5 via-black to-gray-800/5"></div>
      <div className="absolute top-10 left-5 md:top-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-gray-700/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-40 h-40 md:w-80 md:h-80 bg-gray-600/15 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 max-w-full">
        <div className="max-w-4xl mx-auto w-full">
       
          <div className="text-center mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-gray-700/20 to-black/40 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-gray-700/30 shadow-lg shadow-black/30">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 px-2 break-words">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Send Anonymous Message
              </span>
            </h1>

            <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-3 md:p-4 inline-block max-w-full mx-2">
              <div className="flex items-center space-x-2 min-w-0">
                <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base md:text-lg break-all min-w-0">
                  To:{" "}
                  <span className="font-mono text-white font-semibold">
                    @{username}
                  </span>
                </span>
              </div>
            </div>
          </div>

        
          <div className="bg-black/60 backdrop-blur-2xl border border-gray-800/50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-black/30 mb-8 md:mb-12 w-full max-w-full">
          
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 md:space-y-8 w-full"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-300 font-medium text-base md:text-lg flex items-center flex-wrap">
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                        <span className="break-words">
                          Your Anonymous Message
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here... Be respectful and creative!"
                          className="resize-none min-h-[120px] md:min-h-[150px] bg-gray-800/60 border-gray-700/60 text-white rounded-xl md:rounded-2xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60 text-base md:text-lg p-4 md:p-6 w-full"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2">
                        <p className="text-gray-500 text-sm break-words">
                          Share your thoughts anonymously and safely
                        </p>
                        <p className="text-gray-500 text-sm whitespace-nowrap">
                          {messageContent?.length || 0} characters
                        </p>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center w-full">
                  {isLoading ? (
                    <Button
                      disabled
                      className="bg-gray-700/50 text-gray-400 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl cursor-not-allowed w-full sm:w-auto max-w-full"
                    >
                      <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin flex-shrink-0" />
                      <span className="hidden sm:inline truncate">
                        Sending Message...
                      </span>
                      <span className="sm:hidden truncate">Sending...</span>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !messageContent}
                      className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-700/50 w-full sm:w-auto max-w-full"
                    >
                      <Send className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline truncate">
                        Send Anonymous Message
                      </span>
                      <span className="sm:hidden truncate">Send Message</span>
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 flex-shrink-0" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>

        
          <div className="bg-black/60 backdrop-blur-2xl border border-gray-800/50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-black/30 w-full max-w-full">
            <div className="text-center mb-6 md:mb-8">
              <div className="bg-gradient-to-br from-gray-700/20 to-black/40 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 border border-gray-700/30 shadow-lg shadow-black/30">
                <Bot className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 px-2 break-words">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  AI-Powered Suggestions
                </span>
              </h2>

              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 md:mb-6 px-2 break-words">
                Let our AI help you craft the perfect anonymous message
              </p>

              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 border border-gray-700/50 w-full sm:w-auto max-w-full"
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin flex-shrink-0" />
                    <span className="hidden sm:inline truncate">
                      AI is thinking...
                    </span>
                    <span className="sm:hidden truncate">Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">
                      Generate New Suggestions
                    </span>
                    <span className="sm:hidden truncate">Generate Ideas</span>
                    <RefreshCw className="ml-2 h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  </>
                )}
              </Button>

              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 px-2 break-words">
                Click on any suggestion below to use it as your message
              </p>
            </div>

           
            <Card className="bg-gray-800/40 border-gray-700/40 shadow-lg shadow-black/20 w-full max-w-full">
              <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-200 flex items-center flex-wrap">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="break-words">Creative Message Ideas</span>
                </h3>
              </CardHeader>
           
              <CardContent className="pt-0 px-4 md:px-6 pb-4 md:pb-6 overflow-visible">
                {isSuggestLoading ? (
                  <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-12">
                    <div className="bg-gray-700/30 rounded-full p-4 md:p-6 mb-4 md:mb-6">
                      <Bot className="w-8 h-8 md:w-12 md:h-12 text-gray-400 animate-pulse" />
                    </div>
                    <Loader2 className="mr-2 h-6 w-6 md:h-8 md:w-8 animate-spin text-gray-400 mb-3 md:mb-4" />
                    <span className="text-gray-400 text-base md:text-lg text-center break-words">
                      AI is crafting creative questions...
                    </span>
                    <p className="text-gray-500 text-xs md:text-sm mt-2 text-center break-words">
                      This might take a few seconds
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4 w-full">
                    {parseStringMessages(suggestedMessages).map(
                      (message, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="bg-gray-900/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50 text-left p-3 sm:p-4 md:p-6 h-auto transition-all duration-200 group w-full break-words whitespace-normal"
                          onClick={() => handleMessageClick(message)}
                        >
                         
                          <div className="flex items-start w-full gap-2 sm:gap-3 md:gap-4">
                            <div className="bg-gray-700/40 rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-600/40 transition-colors">
                              <span className="text-gray-300 font-semibold text-xs md:text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                           
                              <span className="text-gray-200 text-sm sm:text-base leading-relaxed block break-words whitespace-normal word-break-break-word">
                                {message.trim()}
                              </span>
                              <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2 break-words">
                                Click to use this suggestion
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0 group-hover:text-gray-400 transition-colors" />
                          </div>
                        </Button>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-gray-800/50 my-8 md:my-12" />

       
          <div className="text-center w-full">
            <div className="bg-black/60 backdrop-blur-2xl border border-gray-800/50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl shadow-black/30 w-full max-w-full">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 px-2 break-words">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Want Your Own Message Board?
                </span>
              </h2>

              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-2 break-words">
                Create your own anonymous message board and start receiving
                honest feedback from your audience
              </p>

              <Link href="/sign-up" className="inline-block w-full sm:w-auto">
                <Button className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700/50 w-full sm:w-auto max-w-full">
                  <User className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">
                    Create Your Account
                  </span>
                  <span className="sm:hidden truncate">Create Account</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 flex-shrink-0" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
