"use client";

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
import { PenBox, LayoutDashboard, Menu, X } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full h-16 bg-white/70 backdrop-blur-md z-50 border-b border-gray-200">
      <nav className="px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 w-28 sm:w-36 h-10 sm:h-12 relative border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <Image src="/lgf.jpg" alt="FINOVA" fill className="object-cover" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-gray-700 text-base font-medium ml-8">
          <SignedOut>
            <Link
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="hover:text-blue-600 transition-colors"
            >
              Testimonials
            </Link>
          </SignedOut>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 text-sm"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button size="lg" className="flex items-center gap-2 text-sm">
                <PenBox size={18} />
                Add Transaction
              </Button>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "w-9 h-9" } }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" size="lg" className="text-sm">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <input type="checkbox" id="menu-toggle" className="peer hidden" />
          <label
            htmlFor="menu-toggle"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Menu size={26} className="text-gray-700 peer-checked:hidden" />
            <X size={26} className="text-gray-700 hidden peer-checked:block" />
          </label>

          {/* Mobile Menu Drawer */}
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out z-50 p-5 space-y-4 text-gray-700 text-base overflow-y-auto">
            <SignedOut>
              <Link href="#features" onClick={() => document.getElementById("menu-toggle")?.click()}>
                Features
              </Link>
              <Link href="#testimonials" onClick={() => document.getElementById("menu-toggle")?.click()}>
                Testimonials
              </Link>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline" size="lg" className="w-full mt-4">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" onClick={() => document.getElementById("menu-toggle")?.click()}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>
              </Link>

              <Link href="/transaction/create" onClick={() => document.getElementById("menu-toggle")?.click()}>
                <Button size="lg" className="w-full flex items-center gap-2 mt-2">
                  <PenBox size={18} />
                  Add Transaction
                </Button>
              </Link>

              <div className="flex justify-center mt-4">
                <UserButton
                  appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
