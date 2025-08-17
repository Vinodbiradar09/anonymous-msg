"use client";
import axios, { AxiosError } from "axios";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/User";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useCallback, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw, Copy, Link } from "lucide-react";
import MessageCard from "@/components/MessageCard";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [localAcceptMessages, setLocalAcceptMessages] = useState<
    boolean | undefined
  >(undefined);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { setValue, register } = form;

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      const apiValue = response.data?.isAcceptingMessages || false;
      setValue("acceptMessages", apiValue);

      if (localAcceptMessages === undefined) {
        setLocalAcceptMessages(apiValue);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, localAcceptMessages]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Showing latest messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "No new messages available"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    if (localAcceptMessages === undefined) return;

    const newValue = !localAcceptMessages;
    setLocalAcceptMessages(newValue);

    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: newValue,
      });
      setValue("acceptMessages", newValue);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update setting"
      );
      setLocalAcceptMessages(!newValue);
    }
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400">Please login to access your dashboard</p>
        </div>
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile url has been copied to clip-board");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
        
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-gray-400 text-lg">Welcome back, @{username}</p>
            </div>

          
            <div className="bg-black/30 rounded-xl p-6 border border-gray-700/50 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Link className="text-blue-400 w-5 h-5" />
                <h2 className="text-xl font-semibold text-white">
                  Your Unique Link
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  />
                </div>
                <Button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

          
            <div className="bg-black/30 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Switch
                    {...register("acceptMessages")}
                    checked={localAcceptMessages ?? false}
                    onCheckedChange={handleSwitchChange}
                    disabled={
                      isSwitchLoading || localAcceptMessages === undefined
                    }
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                  />
                  <div>
                    <span className="text-white font-medium text-lg">
                      Accept Messages
                    </span>
                    <p className="text-gray-400 text-sm">
                      {localAcceptMessages
                        ? "Currently accepting new messages"
                        : "Not accepting messages right now"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${localAcceptMessages ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
                  ></div>
                  <span
                    className={`font-medium ${localAcceptMessages ? "text-green-400" : "text-gray-400"}`}
                  >
                    {localAcceptMessages ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Messages</h2>
                <p className="text-gray-400">
                  {messages.length > 0
                    ? `${messages.length} message${messages.length !== 1 ? "s" : ""}`
                    : "No messages yet"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
                disabled={isLoading}
                className="bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500/50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            <Separator className="bg-gray-700/50 mb-8" />

          
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {messages.map((message) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-800/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <RefreshCcw className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  When people send you anonymous messages, they&apos;ll appear
                  here. Share your profile link to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
