"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bike } from "lucide-react";

export function TopNav() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-orange-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-2 rounded-lg shadow-lg">
                            <Bike className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">MotoRide<span className="text-orange-500">.pro</span></span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <SignedOut>
                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center space-x-6">
                                <Link href="/home" className="text-gray-300 hover:text-orange-500 font-medium transition-colors">
                                    Home
                                </Link>
                                <Link href="/about" className="text-gray-300 hover:text-orange-500 font-medium transition-colors">
                                    About
                                </Link>
                                <Link href="/contact" className="text-gray-300 hover:text-orange-500 font-medium transition-colors">
                                    Contact
                                </Link>
                            </div>
                            
                           
                            <SignInButton>
                                <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform text-sm">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <div className="hidden md:flex items-center space-x-6">
                                <Link href="/keys" className="text-gray-300 hover:text-orange-500 font-medium transition-colors">
                                   Home
                                </Link>
                            </div>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
}