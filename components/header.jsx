import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-white/10 backdrop-blur z-50 border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="w-[120px] sm:w-[150px] h-[36px] sm:h-[40px] overflow-hidden relative border rounded-lg shadow-lg hover:shadow-xl transition-transform hover:scale-105 cursor-pointer">
            <Image src="/lgf.jpg" alt="FINOVA" fill className="object-fit" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <SignedOut>
            <Link href="#features">
              <span className="text-gray-600 hover:text-blue-600">Features</span>
            </Link>
            <Link href="#testimonials">
              <span className="text-gray-600 hover:text-blue-600">Testimonials</span>
            </Link>
          </SignedOut>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button size="sm" className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" size="sm">Login</Button>
            </SignInButton>
          </SignedOut>
        </div>

      
        <div className="md:hidden">
          <Menu size={24} className="text-gray-700" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
