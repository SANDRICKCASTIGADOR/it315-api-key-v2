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
import { useEffect, useState } from "react";

type KeyItem = {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

export default function KeysPage() {
  const [name, setName] = useState("My API Key");
  const [justCreated, setJustCreated] = useState<{
    key: string;
    id: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);
  
  async function createKey() {
    setLoading(true);
    try {
      const res =  await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json"},
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok){
        setJustCreated({ key: data.key, id: data.id });
        await load();
      } else {
         alert(data.error ?? "Failed to create key");
      }
    } finally {
      setLoading(false);
    }
  }

  async function load() {
     const res = await fetch("/api/keys", { cache: "no-store" });
     const data = await res.json();
     setItems(data.items ?? []);
  }

  async function revokeKey(id: string) {
    const res = await fetch(`/api/keys?keyId=${id}` , { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Failed to revoke")
    await load();
  }

  useEffect(() => {
    load();
  }, [createKey, revokeKey]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <SignedOut>
       <div className="relative flex items-center justify-center min-h-screen p-6">
         {/* Enhanced background */}
        <div className="absolute inset-0 z-0">
         <div
           className="w-full h-full bg-cover bg-center bg-no-repeat"
             style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80')`, 
             }}
           ></div>
          {/* Enhanced overlay */}
           <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-indigo-900/80"></div>
           </div>

          {/* Additional floating accents */}
          <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-56 h-56 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
           </div>

         {/* Enhanced Content Card */}
         <div className="relative z-20 text-center bg-white/5 backdrop-blur-2xl rounded-3xl p-16 shadow-2xl border border-white/10 max-w-2xl mx-4 hover:bg-white/8 transition-all duration-500">
           {/* Decorative icon */}
           <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
             <KeyRound className="w-10 h-10 text-blue-300" />
           </div>

         {/* Enhanced title */}
         <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            Welcome to Your API Hub
         </h1>

         {/* Enhanced description */}
         <p className="text-blue-100/90 mb-10 leading-relaxed text-xl drop-shadow-lg max-w-lg mx-auto">
           Unlock the power of secure API management. Generate, monitor, and control your keys with enterprise-grade security.
         </p>

         {/* Enhanced button */}
         <SignInButton mode="modal">
        <div className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-400 hover:via-indigo-400 hover:to-purple-400 text-white rounded-2xl font-semibold text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 cursor-pointer border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="relative">Sign In to Continue</span>
        </div>
        </SignInButton>
        </div>
      </div>
      </SignedOut>

      <SignedIn>
        <div className="relative z-10 mx-auto max-w-6xl space-y-10 p-8">
          {/* Enhanced Header */}
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <h1 className="flex items-center gap-3 text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl backdrop-blur-sm border border-white/10">
                  <KeyRound className="h-8 w-8 text-blue-300" />
                </div>
                API Keys Management
              </h1>
              <p className="text-slate-300 text-lg ml-1">
                Secure, scalable API key generation and management
              </p>
            </div>
            <Link href={"/docs"}>
              <Button variant={"outline"} className="flex items-center bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border-amber-400/30 text-amber-200 gap-3 px-6 py-3 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <BookOpen className="h-5 w-5" />
                View Documentation
              </Button>
            </Link>
          </div>

          {/* Enhanced Generate Key Card */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden hover:bg-white/8 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between p-8 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
              <div className="space-y-2">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-green-300" />
                  </div>
                  Generate New API Key
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  Create secure, unique API keys for development, staging, or production environments
                </CardDescription>
              </div>
            <Button 
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 border-0"
               onClick={createKey}  
                >
               <Plus className="h-4 w-4" />
                 Create
            </Button>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Key Name</label>
                <Input
                  placeholder="Enter a descriptive name (e.g., Production API, Development Key)"
                  aria-label="API key Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 text-lg focus:border-blue-400/50 focus:ring-blue-400/20 backdrop-blur-sm"
                />
              </div>
              
              {justCreated && (
              <div className="rounded-2xl border border-green-400/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 shadow-2xl backdrop-blur-sm">
                <div className="text-lg font-semibold text-green-200 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    ✓
                  </span>
                  Your new API Key is ready!
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-green-400/20">
                    <code className="break-all text-green-100 text-lg font-mono flex-1">
                      {justCreated.key}
                    </code>
                    <CopyButton value={justCreated.key} />
                  </div>
                  <p className="text-amber-200 text-sm flex items-center gap-2">
                    <span className="text-amber-400">⚠️</span>
                    Save this key securely. This is the only time you'll be able to see the full key.
                  </p>
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Existing Keys Card */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden hover:bg-white/8 transition-all duration-500">
            <CardHeader className="p-8 bg-gradient-to-r from-slate-500/5 to-gray-500/5">
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-lg flex items-center justify-center">
                  <KeyRound className="h-4 w-4 text-slate-300" />
                </div>
                Active API Keys
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Manage all your active and revoked API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/5">
                      <TableHead className="text-slate-200 font-semibold py-4 px-8">Name</TableHead>
                      <TableHead className="text-slate-200 font-semibold py-4">Key Preview</TableHead>
                      <TableHead className="text-slate-200 font-semibold py-4">Created</TableHead>
                      <TableHead className="text-slate-200 font-semibold py-4">Status</TableHead>
                      <TableHead className="text-right text-slate-200 font-semibold py-4 px-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row, index) => (
                    <TableRow key={row.id} className="border-white/5 hover:bg-white/5 transition-colors duration-200">
                      <TableCell className="py-4 px-8 text-white font-medium">{row.id}</TableCell>
                      <TableCell className="font-mono text-slate-300 bg-black/20 rounded-lg mx-2 py-2 px-3 text-sm">{row.masked}</TableCell>
                      <TableCell className="text-slate-300 py-4">
                           {new Date(row.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                       {row.revoked ? (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-300 border-red-500/30 px-3 py-1 rounded-full">Revoked</Badge>
                       ) : (
                        <Badge className="bg-green-500/10 text-green-300 border-green-500/30 px-3 py-1 rounded-full">Active</Badge>
                       )}
                      </TableCell>
                      <TableCell className="text-right py-4 px-8">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          disabled={row.revoked}
                          onClick={() => revokeKey(row.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50">
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                    ))}
                    {items.length === 0 && (
                       <TableRow>
                         <TableCell colSpan={5} className="text-center text-lg text-slate-400 py-12">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-slate-500/10 rounded-2xl flex items-center justify-center">
                                <KeyRound className="h-8 w-8 text-slate-500" />
                              </div>
                              <div>
                                <p className="font-medium mb-1">No API Keys yet</p>
                                <p className="text-sm text-slate-500">Create your first API key to get started</p>
                              </div>
                            </div>
                         </TableCell>
                       </TableRow>
                    )}     
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-white/10" />
          
          {/* Enhanced footer tip */}
          <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="text-slate-300 text-lg leading-relaxed">
              💡 <span className="font-semibold text-blue-300">Pro Tip:</span> Authenticate API requests using the{" "}
              <code className="rounded-lg bg-slate-800/50 border border-slate-600/30 px-3 py-1 text-blue-300 font-mono">x-api-key</code> header. 
              <br className="sm:hidden" />
              <span className="text-slate-400">Need help? Check out our{" "}</span>
              <Link href={"/docs"} className="underline text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200">
                comprehensive documentation
              </Link>
              <span className="text-slate-400"> for examples and best practices.</span>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
   