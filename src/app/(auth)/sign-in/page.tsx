"use client";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Login failed, Invalid email or password");
      } else {
        console.log("error:", result);
        toast.error(result.error);
      }
    }

    if (result?.url) {
      toast.success("Logged in successfully");
      router.replace("/dashboard");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
     
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-black to-gray-800/10"></div>
      <div className="absolute top-10 left-20 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gray-800/5 to-black/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
      
        <div className="bg-black/80 backdrop-blur-2xl border border-gray-800/60 rounded-3xl p-10 shadow-2xl shadow-black/50">
        
          <div className="text-center mb-10">
            <div className="mb-8">
              <div className="bg-gradient-to-br from-gray-700/30 to-black/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/40 shadow-lg shadow-black/30">
                <Shield className="w-12 h-12 text-gray-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Welcome Back
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-white bg-clip-text text-transparent text-3xl md:text-4xl">
                True Feedback
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg">
              Sign in to continue your secret conversations
            </p>
          </div>

       
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium text-sm">
                      Email/Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input 
                          {...field}
                          className="bg-gray-800/60 border-gray-700/60 text-white pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60"
                          placeholder="Enter your email or username"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input 
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="bg-gray-800/60 border-gray-700/60 text-white pl-11 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

            
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

             
              <Button 
                className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold py-4 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-700/50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
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

        
          <div className="text-center">
            <p className="text-gray-400">
              Not a member yet?{" "}
              <Link 
                href="/sign-up" 
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

      
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <Shield className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Secure</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Private</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <Mail className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Anonymous</p>
          </div>
        </div>

       
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
