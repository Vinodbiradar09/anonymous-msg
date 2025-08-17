"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
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
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  Shield, 
  Check, 
  X,
  Eye,
  EyeOff 
} from "lucide-react";
import { toast } from "sonner";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ??
              "Error while checking the username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Error while registering");
      }

      router.replace(`verify/${username}`);
    } catch (error) {
      console.error("Error occurred while submit the form", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Dark background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-black to-gray-800/10"></div>
      <div className="absolute top-10 left-20 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gray-800/5 to-black/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-lg relative z-10">
        {/* Main Card */}
        <div className="bg-black/80 backdrop-blur-2xl border border-gray-800/60 rounded-3xl p-10 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-8">
              <div className="bg-gradient-to-br from-gray-700/30 to-black/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/40 shadow-lg shadow-black/30">
                <Shield className="w-12 h-12 text-gray-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Join
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-white bg-clip-text text-transparent text-3xl md:text-4xl">
                True Feedback
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg">
              Sign up to start your anonymous adventure
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium text-sm">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input
                          placeholder="Choose your username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                          className="bg-gray-800/60 border-gray-700/60 text-white pl-11 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isCheckingUsername && (
                            <Loader2 className="animate-spin text-gray-500 w-5 h-5" />
                          )}
                          {!isCheckingUsername && usernameMessage && (
                            <div className="flex items-center">
                              {usernameMessage === "Username is unique" ? (
                                <Check className="text-green-400 w-5 h-5" />
                              ) : (
                                <X className="text-red-400 w-5 h-5" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm flex items-center mt-2 ${
                          usernameMessage === "Username is unique"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {usernameMessage === "Username is unique" ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <X className="w-4 h-4 mr-1" />
                        )}
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input 
                          placeholder="Enter your email address" 
                          type="email" 
                          {...field}
                          className="bg-gray-800/60 border-gray-700/60 text-white pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60"
                        />
                      </div>
                    </FormControl>
                    <p className="text-gray-500 text-sm mt-1 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      We will send you a verification code
                    </p>
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
                          placeholder="Create a strong password" 
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="bg-gray-800/60 border-gray-700/60 text-white pl-11 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-200 hover:border-gray-600/60"
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold py-4 rounded-xl shadow-lg shadow-black/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-700/50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating your account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-700/50"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-700/50"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already a member?{" "}
              <Link 
                href="/sign-in" 
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Features */}
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
            <User className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Anonymous</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            By signing up, you agree to our{" "}
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
