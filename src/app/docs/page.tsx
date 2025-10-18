"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, BookOpen, Code2, Network } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

const baseUrl = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_APP_URL || "https://it315-api-key-v2-637z.vercel.app";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("Honda Click");

  async function runGET() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "GET",
      headers: { "x-api-key": key },
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  async function runPOST() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: { 
        "x-api-key": key, 
        "content-type": 
        "application/json" 
      },
      body: JSON.stringify({ postBody }),
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  async function runOPTIONS() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "OPTIONS",
      // headers: { 
      //   Origin: "http://localhost:3000",
      //   "Access-Control-Request-Method": "POST",
      //   "Access-Control-Request-Headers": "x-api-key, content-type",
      // },   
    });
    setOut(
      `Status: ${res.status}\n ` +
       Array.from(res.headers.entries())
       .map(([key, value]) => `${key}: ${value}`)
       .join("\n"),
    );
  }

   

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-700/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
            <div className="p-3 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl backdrop-blur-sm border border-orange-500/40">
              <BookOpen className="h-7 w-7 text-orange-400" />
            </div>
            API Documentation
          </h1>
          <Link href="/keys">
            <Button
              variant="outline"
              className="flex items-center gap-3 px-6 py-3 text-lg rounded-xl
                         bg-gray-700 hover:bg-gray-600
                         border-gray-600 text-white 
                         backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <KeyRound className="h-5 w-5" />
              Keys Dashboard
            </Button>
          </Link>
        </div>

        {/* Authentication Guide */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-t-2xl border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-lg flex items-center justify-center border border-orange-500/40">
                <Network className="h-5 w-5 text-orange-400" />
              </div>
              Authentication
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Authenticate using the <code className="bg-gray-700/50 px-2 py-1 rounded text-orange-300">x-api-key</code> header. Create a key in <code className="bg-gray-700/50 px-2 py-1 rounded text-orange-300">/keys</code> and store it securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="font-semibold text-white">Base URL</h3>
              <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg mt-2 overflow-x-auto border border-gray-700">
                <code>{baseUrl + "/api"}</code>
              </pre>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent h-px border-0" />

            <div className="space-y-4">
              <h3 className="font-semibold text-white">GET /api/ping</h3>
              <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto border border-gray-700">
                <code>{`curl -H "x-api-key: <YOUR_KEY>" ${baseUrl}/api/ping`}</code>
              </pre>
              <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto border border-gray-700">
                <code>{`const r = await fetch("${baseUrl}/api/ping", {
  headers: { "x-api-key": process.env.MY_KEY! }
});`}</code>
              </pre>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent h-px border-0" />

            <div className="space-y-4">
              <h3 className="font-semibold text-white">POST /api/echo</h3>
              <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto border border-gray-700">
                <code>{`curl -X POST 
  -H "x-api-key: <YOUR_KEY>" 
  -H "content-type: application/json" 
  -d '{"hello":"world"}' 
  ${baseUrl}/api/echo`}</code>
              </pre>
              <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto border border-gray-700">
                <code>{`const r = await fetch("${baseUrl}/api/echo", {
  method: "POST",
  headers: { 
    "x-api-key": process.env.MY_KEY!, 
    "content-type": "application/json" 
  },
  body: JSON.stringify({ hello: "world" })
});`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Tester */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-t-2xl border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-lg flex items-center justify-center border border-orange-500/40">
                <Code2 className="h-5 w-5 text-orange-400" />
              </div>
              Interactive Tester
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Try out the API endpoints directly from your browser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Input
              placeholder="Paste your API key (sk_...)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />

            <div className="flex gap-2">
              <Button onClick={runGET} className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white border-0">
                Test GET /api/ping
              </Button>
              <Button onClick={runPOST} className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white border-0">
                Test POST /api/echo
              </Button>
              <Button onClick={runOPTIONS} className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white border-0">
                Test OPTIONS
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">POST body (JSON)</Label>
              <Textarea
                rows={5}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-300">Response</Label>
              <Textarea
                rows={10}
                readOnly
                value={out}
                className="bg-black/40 border-gray-700 text-green-300 font-mono"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}