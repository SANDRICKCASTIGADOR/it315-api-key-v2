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

const baseUrl =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState(`{ "hello": "world" }`);

  async function runGET() {
    const res = await fetch(`${baseUrl}/api/ping`, {
      headers: { "x-api-key": key },
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  async function runPOST() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: { "x-api-key": key, "content-type": "application/json" },
      body: postBody,
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          <BookOpen className="h-7 w-7 text-blue-300" />
          API Documentation
        </h1>
        <Link href={"/keys"}>
        <Button 
            variant="outline"
              className="flex items-center gap-3 px-6 py-3 text-lg rounded-xl
                  bg-gradient-to-r from-amber-500/10 to-yellow-500/10
                hover:from-amber-500/20 hover:to-yellow-500/20
                border-amber-400/30 text-amber-200 
                  backdrop-blur-sm transition-all duration-300 hover:scale-105"
        >
            <KeyRound className="h-5 w-5" />
                Keys Dashboard
        </Button>
        </Link>

      </div>

      {/* Authentication Guide */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-t-2xl">
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            <Network className="h-5 w-5 text-blue-300" />
            Authentication
          </CardTitle>
          <CardDescription className="text-slate-300">
            Use your API key to authenticate requests with the <code>x-api-key</code> header
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="font-semibold text-white">Base URL</h3>
            <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg mt-2 overflow-x-auto">
              <code>{baseUrl + "/api"}</code>
            </pre>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-4">
            <h3 className="font-semibold text-white">GET /api/ping</h3>
            <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto">
              <code>{`curl -H "x-api-key: <YOUR_KEY>" ${baseUrl}/api/ping`}</code>
            </pre>
            <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto">
              <code>{`const r = await fetch("${baseUrl}/api/ping", {
  headers: { "x-api-key": process.env.MY_KEY! }
});`}</code>
            </pre>
          </div>

          <Separator className="bg-white/10" />

          <div className="space-y-4">
            <h3 className="font-semibold text-white">POST /api/echo</h3>
            <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto">
              <code>{`curl -X POST 
  -H "x-api-key: <YOUR_KEY>" 
  -H "content-type: application/json" 
  -d '{Hello World}' 
  ${baseUrl}/api/echo`}</code>
            </pre>
            <pre className="bg-black/40 text-blue-200 text-sm p-3 rounded-lg overflow-x-auto">
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
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-t-2xl">
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            <Code2 className="h-5 w-5 text-indigo-300" />
            Interactive Tester
          </CardTitle>
          <CardDescription className="text-slate-300">
            Try out the API endpoints directly from your browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <Input
            placeholder="Paste your API key (sk_...)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-black/40 border-white/10 text-white placeholder:text-slate-400"
          />

          <div className="flex gap-2">
            <Button onClick={runGET} className="flex-1">
              Test GET /api/ping
            </Button>
            <Button onClick={runPOST} className="flex-1">
              Test POST /api/echo
            </Button>
          </div>

          <div>
            <Label className="text-sm font-medium text-white">POST body (JSON)</Label>
            <Textarea
              rows={5}
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              className="bg-black/40 border-white/10 text-white font-mono"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-white">Response</Label>
            <Textarea
              rows={10}
              readOnly
              value={out}
              className="bg-black/40 border-white/10 text-green-300 font-mono"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
