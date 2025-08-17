"use client";
import Link from "next/link";
import { User } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { 
  LogOut, 
  User as UserIcon, 
  Shield, 
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl shadow-black/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-gray-700/40 to-black/60 w-10 h-10 rounded-full flex items-center justify-center border border-gray-700/40 shadow-lg shadow-black/30 group-hover:from-gray-600/40 group-hover:to-black/80 transition-all duration-300">
              <Shield className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-gray-200 group-hover:via-white group-hover:to-gray-300 transition-all duration-300">
              True Feedback
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 bg-gray-800/40 border border-gray-700/40 rounded-full px-4 py-2 shadow-lg shadow-black/20">
                  <div className="bg-gray-700/40 rounded-full p-1.5">
                    <UserIcon className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-gray-300 font-medium text-sm">
                    Welcome, <span className="text-white font-semibold">{user?.username || user?.email}</span>
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="bg-gray-800/40 hover:bg-gray-700/60 border-gray-700/40 hover:border-gray-600/60 text-gray-300 hover:text-white transition-all duration-200 shadow-lg shadow-black/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 border-gray-700/50 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-black/25"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/40 text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800/50">
            <div className="space-y-4">
              {session ? (
                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 bg-gray-800/40 border border-gray-700/40 rounded-lg px-4 py-3 shadow-lg shadow-black/20">
                    <div className="bg-gray-700/40 rounded-full p-2">
                      <UserIcon className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Welcome back</p>
                      <p className="text-white font-semibold text-sm">
                        {user?.username || user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Logout Button */}
                  <Button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full bg-gray-800/40 hover:bg-gray-700/60 border-gray-700/40 hover:border-gray-600/60 text-gray-300 hover:text-white transition-all duration-200 shadow-lg shadow-black/20 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 border-gray-700/50 text-white font-semibold transition-all duration-300 shadow-lg shadow-black/25 justify-start"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
