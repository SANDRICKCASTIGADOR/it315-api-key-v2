"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookOpen, Plus, KeyRound, Trash2, Monitor, Cpu, HardDrive } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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

type HardwareSpecs = {
  brandname: string;
  processor: string;
  graphic: string;
  display: string;
  ram: string;
  storage: string;
};

export default function KeysPage() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hardwareSpecs, setHardwareSpecs] = useState<HardwareSpecs>({
    brandname: "",
    processor: "",
    graphic: "",
    display: "",
    ram: "",
    storage: "",
  });
  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

  
async function createKey() {
  setLoading(true);
  try {
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "content-type": "application/json"},
      body: JSON.stringify({ 
        name: name || undefined,
        hardwareSpecs: {
          imageUrl: imageUrl || undefined,  // Move imageUrl inside hardwareSpecs
          brandname: hardwareSpecs.brandname || undefined,
          processor: hardwareSpecs.processor || undefined,
          graphic: hardwareSpecs.graphic || undefined,
          display: hardwareSpecs.display || undefined,
          ram: hardwareSpecs.ram || undefined,
          storage: hardwareSpecs.storage || undefined,
        }
      }),

      });
      const data = await res.json();
      if (res.ok){
        setJustCreated({ key: data.key, id: data.id });
        // Reset form
        setName("");
        setImageUrl("");
        setHardwareSpecs({
          brandname: "",
          processor: "",
          graphic: "",
          display: "",
          ram: "",
          storage: "",
        });
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
  }, []);

  const updateHardwareSpec = (field: keyof HardwareSpecs, value: string) => {
    setHardwareSpecs(prev => ({ ...prev, [field]: value }));
  };

  // Function to format the key display like sk_live_...
  const formatKeyDisplay = (maskedKey: string) => {
    // If it's already in the correct format, return as is
    if (maskedKey.startsWith('sk_live_') || maskedKey.startsWith('sk_test_')) {
      return maskedKey;
    }
    
    // Otherwise, format it as sk_live_[masked portion]
    return `sk_live_${maskedKey}`;
  };

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
            Welcome to Your CodeVault
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
        <div className="relative z-10 mx-auto max-w-7xl space-y-10 p-8">
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
                Secure, scalable API key generation and management with hardware tracking
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
                  Create secure API keys with device specifications for better tracking
                </CardDescription>
              </div>
            <Button 
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 border-0"
               onClick={createKey}  
               disabled={loading}
                >
               <Plus className="h-4 w-4" />
                 {loading ? "Creating..." : "Create"}
            </Button>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-2">
  <Label className="text-sm font-medium text-slate-300">Name</Label>
  <Input
    placeholder="Enter key name (e.g., Project Alpha)"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 text-lg focus:border-blue-400/50 focus:ring-blue-400/20 backdrop-blur-sm"
  />
</div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-blue-300" />
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Image URL</Label>
                  <Input
                    placeholder="Enter image URL (e.g., https://example.com/device.jpg)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 text-lg focus:border-blue-400/50 focus:ring-blue-400/20 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-purple-300" />
                  Hardware Specifications (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Brand Name</Label>
                    <Input
                      placeholder="e.g., Dell, HP, Apple, ASUS"
                      value={hardwareSpecs.brandname}
                      onChange={(e) => updateHardwareSpec('brandname', e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Processor</Label>
                    <Input
                      placeholder="e.g., Intel Core i7-13700H, AMD Ryzen 7"
                      value={hardwareSpecs.processor}
                      onChange={(e) => updateHardwareSpec('processor', e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Graphics Card</Label>
                    <Input
                      placeholder="e.g., NVIDIA RTX 4070, AMD RX 7600"
                      value={hardwareSpecs.graphic}
                      onChange={(e) => updateHardwareSpec('graphic', e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Display</Label>
                    <Input
                      placeholder="e.g., 15.6 inch 1920x1080 IPS"
                      value={hardwareSpecs.display}
                      onChange={(e) => updateHardwareSpec('display', e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">RAM</Label>
                    <Input
                      placeholder="e.g., 16GB DDR5, 32GB DDR4"
                      value={hardwareSpecs.ram}
                      onChange={(e) => updateHardwareSpec('ram', e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Storage</Label>
                    <Input
                      placeholder="e.g., 512GB NVMe SSD, 1TB HDD"
                      value={hardwareSpecs.storage}
                      onChange={(e) => updateHardwareSpec('storage', e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 rounded-xl py-3 px-4 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                </div>
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

          {/* API Keys Table */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden hover:bg-white/8 transition-all duration-500">
            <CardHeader className="p-8 bg-gradient-to-r from-slate-500/5 to-gray-500/5">
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-lg flex items-center justify-center">
                  <KeyRound className="h-4 w-4 text-slate-300" />
                </div>
                API Keys Overview
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Manage your API keys with name, key, and status information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/5">
                      <TableHead className="text-slate-200 font-semibold py-4 px-6">Name</TableHead>
                      <TableHead className="text-slate-200 font-semibold py-4">Key</TableHead>
                      <TableHead className="text-slate-200 font-semibold py-4">Created</TableHead>
                      <TableHead className="text-slate-200 font-semibold py-4">Status</TableHead>
                      <TableHead className="text-right text-slate-200 font-semibold py-4 px-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row, index) => (
                    <TableRow key={row.id} className="border-white/5 hover:bg-white/5 transition-colors duration-200">
                      <TableCell className="py-4 px-6 font-medium text-slate-200">
                        {row.name || <span className="text-slate-500 italic">Unnamed Key #{index + 1}</span>}
                      </TableCell>
                      <TableCell className="font-mono text-slate-300 bg-black/20 rounded-lg mx-2 py-2 px-3 text-sm min-w-[200px]">
                        {formatKeyDisplay(row.masked)}
                      </TableCell>
                      <TableCell className="text-slate-300 py-4 text-sm">
                           {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-4">
                       {row.revoked ? (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-300 border-red-500/30 px-3 py-1 rounded-full">Revoked</Badge>
                       ) : (
                        <Badge className="bg-green-500/10 text-green-300 border-green-500/30 px-3 py-1 rounded-full">Active</Badge>
                       )}
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          disabled={row.revoked}
                          onClick={() => revokeKey(row.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50">
                          <Trash2 className="h-4 w-4 mr-1" />
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

          {/* Hardware Specifications Table */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden hover:bg-white/8 transition-all duration-500">
            <CardHeader className="p-8 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Monitor className="h-4 w-4 text-purple-300" />
                </div>
                Hardware Specifications
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Device images and hardware specifications for each API key
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
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
            </CardContent>
          </Card>

          <Separator className="bg-white/10" />
          
          {/* Enhanced footer tip */}
          <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="text-slate-300 text-lg leading-relaxed">
              💡 <span className="font-semibold text-blue-300">Pro Tip:</span> Authenticate API requests using the{" "}
              <code className="rounded-lg bg-slate-800/50 border border-slate-600/30 px-3 py-1 text-blue-300 font-mono">x-api-key</code> header. 
              <br className="sm:hidden" />
              <span className="text-slate-400">Hardware specs help you track which devices are using each key.{" "}</span>
              <Link href={"/docs"} className="underline text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200">
                Check our documentation
              </Link>
              <span className="text-slate-400"> for examples and best practices.</span>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}