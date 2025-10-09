"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Monitor, Cpu, HardDrive } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type KeyItem = {
  id: string;
  name?: string;
  imageUrl?: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
  brandname?: string;
  processor?: string;
  graphic?: string;
  display?: string;
  ram?: string;
  storage?: string;
};

export default function HardwarePage() {
  const [items, setItems] = useState<KeyItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to load hardware specs:", res.status);
        setItems([]);
        return;
      }
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (error) {
      console.error("Failed to load hardware specs:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <SignedOut>
        <div className="relative flex items-center justify-center min-h-screen p-6">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80')`, 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-indigo-900/80"></div>
          </div>

          <div className="relative z-20 text-center bg-white/5 backdrop-blur-2xl rounded-3xl p-16 shadow-2xl border border-white/10 max-w-2xl mx-4 hover:bg-white/8 transition-all duration-500">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Monitor className="w-10 h-10 text-purple-300" />
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
              Hardware Specifications
            </h1>

            <p className="text-blue-100/90 mb-10 leading-relaxed text-xl drop-shadow-lg max-w-lg mx-auto">
              View detailed hardware information for all your API keys in one place.
            </p>

            <SignInButton mode="modal">
              <div className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-400 hover:via-indigo-400 hover:to-blue-400 text-white rounded-2xl font-semibold text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25 cursor-pointer border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">Sign In to Continue</span>
              </div>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="relative z-10 mx-auto max-w-7xl space-y-10 p-8">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <h1 className="flex items-center gap-3 text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl backdrop-blur-sm border border-white/10">
                  <Monitor className="h-8 w-8 text-purple-300" />
                </div>
                Hardware Specifications
              </h1>
              <p className="text-slate-300 text-lg ml-1">
                View detailed device specifications for all API keys
              </p>
            </div>
            <Link href={"/"}>
              <Button variant={"outline"} className="flex items-center bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-400/30 text-blue-200 gap-3 px-6 py-3 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <ArrowLeft className="h-5 w-5" />
                Back to API Keys
              </Button>
            </Link>
          </div>

          {/* Hardware Specifications Table */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden hover:bg-white/8 transition-all duration-500">
            <CardHeader className="p-8 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Monitor className="h-4 w-4 text-purple-300" />
                </div>
                Device Hardware Information
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Complete hardware specifications for each API key
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 bg-white/5">
                        <TableHead className="text-slate-200 font-semibold py-4 px-6">Key Name</TableHead>
                        <TableHead className="text-slate-200 font-semibold py-4">Device Image</TableHead>
                        <TableHead className="text-slate-200 font-semibold py-4">Brand</TableHead>
                        <TableHead className="text-slate-200 font-semibold py-4">Processor</TableHead>
                        <TableHead className="text-slate-200 font-semibold py-4">Graphics</TableHead>
                        <TableHead className="text-slate-200 font-semibold py-4">Display</TableHead>
                        <TableHead className="text-slate-200 font-semibold py-4">Memory</TableHead>
                        <TableHead className="text-slate-200 font-semibold py-4 px-6">Storage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((row, index) => (
                        <TableRow key={`specs-${row.id}`} className="border-white/5 hover:bg-white/5 transition-colors duration-200">
                          <TableCell className="py-4 px-6 font-medium text-slate-200">
                            {row.name || <span className="text-slate-500 italic">Unnamed Key #{index + 1}</span>}
                          </TableCell>
                          <TableCell className="py-4">
                            {row.imageUrl ? (
                              <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-black/20 shadow-lg">
                                <img 
                                  src={row.imageUrl} 
                                  alt="Device" 
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800/50"><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>';
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-lg border border-white/10 bg-slate-500/10 flex items-center justify-center">
                                <Monitor className="h-8 w-8 text-slate-500" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-slate-300">
                            {row.brandname ? (
                              <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-blue-400" />
                                <span>{row.brandname}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">Not specified</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-slate-300 max-w-[150px]">
                            {row.processor ? (
                              <div className="flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-green-400 flex-shrink-0" />
                                <span className="truncate" title={row.processor}>{row.processor}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">Not specified</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-slate-300 max-w-[150px]">
                            {row.graphic ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-400 rounded-sm flex-shrink-0"></div>
                                <span className="truncate" title={row.graphic}>{row.graphic}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">Not specified</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-slate-300 max-w-[120px]">
                            {row.display ? (
                              <span className="truncate" title={row.display}>{row.display}</span>
                            ) : (
                              <span className="text-slate-500 text-sm">Not specified</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-slate-300">
                            {row.ram ? (
                              <div className="flex items-center gap-2">
                                <HardDrive className="h-4 w-4 text-orange-400" />
                                <span>{row.ram}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">Not specified</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-slate-300">
                            {row.storage ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-cyan-400 rounded-full flex-shrink-0"></div>
                                <span>{row.storage}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">Not specified</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-lg text-slate-400 py-12">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                                <Monitor className="h-8 w-8 text-purple-500" />
                              </div>
                              <div>
                                <p className="font-medium mb-1">No Hardware Specifications</p>
                                <p className="text-sm text-slate-500">Add hardware specs when creating API keys to see them here</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}     
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="text-slate-300 text-lg leading-relaxed">
              💡 <span className="font-semibold text-purple-300">Tip:</span> Hardware specifications help you track which devices are using each API key.
              <br className="sm:hidden" />
              <span className="text-slate-400"> Keep your device information up to date for better management and security monitoring.</span>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}