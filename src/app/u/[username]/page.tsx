"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, RefreshCw } from "lucide-react";
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
      // Non-streaming: just await the API and set full string. Simple!
      const response = await axios.post<{ suggestions: string }>("/api/suggest-messages");
      // suggestions is a string joined by '||'
      setSuggestedMessages(response.data.suggestions);
    } catch (error) {
      toast.error("Failed to generate message suggestions");
      setSuggestedMessages(initialMessageString);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Suggest Messages
              </>
            )}
          </Button>
          <p className="text-sm text-gray-600">
            Click on any message below to select it.
          </p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">
              💡 AI-Generated Suggestions
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {isSuggestLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>AI is crafting creative questions...</span>
              </div>
            ) : (
              parseStringMessages(suggestedMessages).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 p-4 h-auto text-left justify-start hover:bg-blue-50"
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-start">
                    <span className="mr-3 text-blue-500 font-semibold">
                      {index + 1}.
                    </span>
                    <span className="flex-1">{message.trim()}</span>
                  </div>
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
