"use client";
import Link from "next/link";
import { User } from "next-auth"; // this User contains the info
import { useSession, signOut } from "next-auth/react"; // useSession is hook method and signOut is for logging out the user
import { Button } from "./ui/button";
const Navbar = () => {
  const { data: session } = useSession(); // this method gives us the data
  const user: User = session?.user; // here from the session i am extracting the user
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-950 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
