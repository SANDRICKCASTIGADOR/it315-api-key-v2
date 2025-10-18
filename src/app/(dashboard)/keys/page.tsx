"use client";

import { KeyRound, Plus, XCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

type ApiKey = {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

export default function ApiKeysPage() {
  const [keyName, setKeyName] = useState("");
  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ApiKey[]>([]);
  const [copied, setCopied] = useState(false);

  async function createKey() {
    if (!keyName.trim()) {
      alert("Please enter a key name");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: keyName }),
      });
      const data = await res.json();

      if (res.ok) {
        setJustCreated({ key: data.key, id: data.id });
        setKeyName("");
        await load();
      } else {
        alert(`Error: ${data.error ?? "Failed to create API key"}`);
      }
    } catch (error) {
      console.error("Error creating key:", error);
      alert("Error creating API key");
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to load keys:", res.status);
        setItems([]);
        return;
      }
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (error) {
      console.error("Error loading keys:", error);
      setItems([]);
    }
  }

  async function revokeKey(id: string) {
    try {
      const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to revoke key");
        return;
      }
      await load();
    } catch (error) {
      console.error("Error revoking key:", error);
      alert("Error revoking key");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const formatKeyDisplay = (maskedKey: string) => {
    if (maskedKey && maskedKey.startsWith('sk_')) {
      return maskedKey;
    }
    return `sk_live_${maskedKey}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-700/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl space-y-10 p-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h1 className="flex items-center gap-3 text-4xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
              <div className="p-3 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl backdrop-blur-sm border border-orange-500/40">
                <KeyRound className="h-8 w-8 text-orange-400" />
              </div>
              API Keys Management
            </h1>
            <p className="text-gray-300 text-lg ml-1">
              Create and manage your API keys for secure access
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/hardware">
              <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
                Upload Motors
              </button>
            </a>
            <a href="/gallery">
              <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
                View Gallery
              </button>
            </a>
          </div>
        </div>

        {/* Create Key Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex flex-row items-center justify-between p-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-700">
            <div className="space-y-2">
              <h2 className="text-2xl text-white flex items-center gap-3 font-semibold">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-lg flex items-center justify-center border border-orange-500/40">
                  <Plus className="h-4 w-4 text-orange-400" />
                </div>
                Generate New API Key
              </h2>
              <p className="text-gray-400 text-lg">
                Create a new API key for your application
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-orange-600/50 transition-all duration-300 border-0 disabled:opacity-50 text-lg font-semibold"
              onClick={createKey}
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
          <div className="space-y-8 p-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Key Name</label>
              <input
                placeholder="e.g., Production API Key"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none backdrop-blur-sm transition"
              />
            </div>

            {justCreated && (
              <div className="rounded-2xl border border-orange-500/50 bg-gradient-to-r from-orange-600/20 to-orange-700/20 p-6 shadow-2xl backdrop-blur-sm">
                <div className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">✓</span>
                  Your new API Key is ready!
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-orange-500/30">
                    <code className="break-all text-orange-200 text-lg font-mono flex-1">
                      {justCreated.key}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(justCreated.key);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap flex-shrink-0"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-amber-200 text-sm flex items-center gap-2">
                    
                    Save this key securely. This is the only time you'll be able to see the full key.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keys Overview Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-700">
            <h2 className="text-2xl text-white flex items-center gap-3 font-semibold mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-lg flex items-center justify-center border border-orange-500/40">
                <KeyRound className="h-4 w-4 text-orange-400" />
              </div>
              API Keys Overview
            </h2>
            <p className="text-gray-400 text-lg">
              Manage your API keys
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-gray-700 bg-gray-800/50">
                  <th className="text-gray-200 font-semibold py-4 px-6 text-left">Name</th>
                  <th className="text-gray-200 font-semibold py-4">Key</th>
                  <th className="text-gray-200 font-semibold py-4">Created</th>
                  <th className="text-gray-200 font-semibold py-4">Status</th>
                  <th className="text-right text-gray-200 font-semibold py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, index) => (
                  <tr key={row.id} className="border-gray-700 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-4 px-6 font-medium text-gray-200">
                      {row.name || <span className="text-gray-500 italic">Unnamed Key #{index + 1}</span>}
                    </td>
                    <td className="font-mono text-gray-300 bg-gray-700/30 rounded-lg mx-2 py-2 px-3 text-sm">
                      {formatKeyDisplay(row.masked)}
                    </td>
                    <td className="text-gray-300 py-4 text-sm text-center">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-center">
                      {row.revoked ? (
                        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                          <XCircle className="h-3 w-3" />
                          Revoked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="text-right py-4 px-6">
                      <button
                        disabled={row.revoked}
                        onClick={() => revokeKey(row.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="h-4 w-4 inline mr-1" />
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-lg text-gray-400 py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-700/30 rounded-2xl flex items-center justify-center">
                          <KeyRound className="h-8 w-8 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">No API Keys yet</p>
                          <p className="text-sm text-gray-500">Create your first API key to get started</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

        <div className="text-center p-8 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl rounded-lg border border-gray-700">
          <div className="text-gray-300 text-lg leading-relaxed">
            💡 <span className="font-semibold text-orange-400">Pro Tip:</span> Keep your API keys secure and never share them publicly. Use the{" "}
            <code className="rounded-lg bg-gray-700/50 border border-gray-600/30 px-3 py-1 text-orange-300 font-mono">x-api-key</code> header for authentication.
          </div>
        </div>
      </div>
    </main>
  );
}