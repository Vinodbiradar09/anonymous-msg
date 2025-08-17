"use client";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Shield, Mail, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error occurred while verifying the code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
    
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-black to-gray-800/10"></div>
      <div className="absolute top-10 left-20 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gray-800/5 to-black/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-lg relative z-10">
      
        <div className="bg-black/80 backdrop-blur-2xl border border-gray-800/60 rounded-3xl p-10 shadow-2xl shadow-black/50">
        
          <div className="text-center mb-10">
            <div className="mb-8">
              <div className="bg-gradient-to-br from-gray-700/30 to-black/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/40 shadow-lg shadow-black/30">
                <CheckCircle className="w-12 h-12 text-gray-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Verify Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-white bg-clip-text text-transparent text-3xl md:text-4xl">
                Account
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-2">
              Enter the verification code sent to your email
            </p>
            
           
            <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-4 mt-6">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  Verification code sent to account: <span className="font-mono text-gray-200">@{params.username}</span>
                </span>
              </div>
            </div>
          </div>

        
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium text-sm">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input 
                          placeholder="Enter 6-digit verification code" 
                          {...field} 
                          type="number"
                          className="bg-gray-800/60 border-gray-700/60 text-white pl-11 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60 text-center text-lg font-mono tracking-wider"
                          maxLength={6}
                        />
                      </div>
                    </FormControl>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mt-2">
                        Please check your email inbox and spam folder
                      </p>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

            
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold py-4 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-700/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verify Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

        
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-700/50"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-700/50"></div>
          </div>

         
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Didn&apos;t receive the code?
            </p>
            <div className="flex flex-col space-y-2">
              <button 
                type="button"
                className="text-gray-300 hover:text-white text-sm transition-colors underline"
                onClick={() => toast.info("Please check your spam folder first")}
              >
                Check spam folder
              </button>
              <button 
                type="button"
                className="text-gray-300 hover:text-white text-sm transition-colors underline"
                onClick={() => toast.info("Resend functionality coming soon")}
              >
                Resend verification code
              </button>
            </div>
          </div>
        </div>

      
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <Shield className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Secure</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <CheckCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Verified</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <Mail className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Email Protected</p>
          </div>
        </div>

      
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Having trouble? Contact our{" "}
            <button 
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors underline"
              onClick={() => toast.info("Support coming soon")}
            >
              support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
