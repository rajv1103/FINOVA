import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed  top-0 w-full h-16 bg-white/20 backdrop-blur-md z-50 border-b border-gray-200">
      <nav className="px-auto mx-20 h-full flex items-center justify-between ">
        
        {/* Logo - pushed left and enlarged */}
        <Link
          href="/"
          className="flex-shrink-0 w-44 sm:w-48 h-14 sm:h-12
                     border rounded-lg overflow-hidden shadow-md
                     hover:shadow-lg transition-shadow duration-200
                     relative"
        >
          <Image
            src="/lgf.jpg"
            alt="FINOVA"
            fill
            className="object-strech"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 text-lg ml-8">
          <SignedOut>
            <Link href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="hover:text-blue-600 transition-colors">
              Testimonials
            </Link>
          </SignedOut>
        </div>

        {/* Desktop Actions - aligned right */}
        <div className="hidden md:flex items-center space-x-6 ml-auto">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 text-base"
              >
                <LayoutDashboard size={20} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button size="lg" className="flex items-center gap-2 text-base">
                <PenBox size={20} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" size="lg" className="text-base">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={28} className="text-gray-700" />
        </button>
      </nav>
    </header>
  );
};

export default Header;
