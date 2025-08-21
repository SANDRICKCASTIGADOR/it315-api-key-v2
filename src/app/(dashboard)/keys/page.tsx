"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookOpen, Plus, KeyRound, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "~/components/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function KeysPage() {
  const sampleApiKey = "fgwegrfwerty78t78!";

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 text-white">
      <SignedOut>
       <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
         {/* Background */}
        <div className="absolute inset-0 z-0">
         <div
           className="w-full h-full bg-cover bg-center bg-no-repeat"
             style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80')`, 
             }}
           ></div>
          {/* Dark overlay */}
           <div className="absolute inset-0 bg-black/70"></div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-indigo-900/40 to-blue-900/40"></div>
           </div>

          {/* Floating background accents */}
          <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-pulse"></div>
           </div>

         {/* Content Card */}
         <div className="relative z-20 text-center bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-lg mx-4">
     

         {/* Title */}
         <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to Your Dashboard
         </h1>

         {/* Description */}
         <p className="text-blue-100 mb-8 leading-relaxed text-lg drop-shadow-md">
           Sign in to access analytics, manage users, and control your settings —
           everything you need in one place.
         </p>

         {/* Button */}
         <SignInButton mode="modal">
        <div className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
          Sign In to Continue
        </div>
        </SignInButton>
        </div>
      </div>
      </SignedOut>

      <SignedIn>
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <KeyRound className="h-6 w-6 text-blue-400" />
                API Keys
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage and generate secure API keys for your applications
              </p>
            </div>
            <Link href={"/docs"}>
              <Button variant={"outline"} className="flex items-center bg-amber-100 text-black gap-2">
                <BookOpen className="h-4 w-4" />
                View Documentation
              </Button>
            </Link>
          </div>

          {/* Generate Key */}
          <Card className="bg-white-900/70 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generate New API Key</CardTitle>
                <CardDescription>
                  Create a unique API key for development, staging, or production use
                </CardDescription>
              </div>
              <Button className="bg-white text-black flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Key Name (e.g., Production)"
                aria-label="API key Name"
                className="bg-gray-800"
              />

              {/* Example of newly created key */}
              <div className="rounded-md border border-gray-700 bg-gray-800/60 p-4 shadow-inner">
                <p className="text-sm font-medium">Here is your new API Key (visible once):</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="break-all rounded bg-white/50 px-2 py-1 text-sm">
                    {sampleApiKey}
                  </code>
                  <CopyButton value={sampleApiKey} />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  ⚠️ Save this key securely. You won’t be able to see it again.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Existing Keys */}
          <Card className="bg-white-900/70 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Your Keys</CardTitle>
              <CardDescription>All active and revoked API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Production</TableCell>
                    <TableCell className="font-mono">{sampleApiKey}</TableCell>
                    <TableCell>Aug 17, 2025</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" className="flex items-center gap-1">
                        <Trash2 className="h-4 w-4" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Empty state */}
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-white-500">
                      No API Keys yet
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Separator />
          <p className="text-center text-sm text-gray-400">
            💡 Tip: Call secured endpoints with the{" "}
            <code className="rounded bg-gray-800 px-1 py-0.5">x-api-key</code> header. See{" "}
            <Link href={"/docs"} className="underline text-blue-400 hover:text-blue-300">
              Docs
            </Link>
            .
          </p>
        </div>
      </SignedIn>
    </main>
  );
}
