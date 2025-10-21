"use client";

import { KeyRound, Plus, XCircle, CheckCircle, Upload, Bike } from "lucide-react";
import { useState, useEffect } from "react";

type ApiKey = {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
  hardwareSpec?: {
    motorName: string;
    description: string;
    monthlyPrice: string;
    fullyPaidPrice: string;
    frontView: string;
    sideView: string;
    backView: string;
  };
};

export default function ApiKeysPage() {
  const [motorName, setMotorName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [fullyPaidPrice, setFullyPaidPrice] = useState("");
  const [frontView, setFrontView] = useState("");
  const [sideView, setSideView] = useState("");
  const [backView, setBackView] = useState("");
  
  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ApiKey[]>([]);
  const [copied, setCopied] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({
    front: false,
    side: false,
    back: false,
  });

  const handleImageUpload = async (file: File, view: 'front' | 'side' | 'back') => {
    setUploadingImages(prev => ({ ...prev, [view]: true }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      const fileUrl = result.url;

      if (!fileUrl) {
        throw new Error('No URL in response');
      }

      if (view === 'front') setFrontView(fileUrl);
      else if (view === 'side') setSideView(fileUrl);
      else if (view === 'back') setBackView(fileUrl);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to upload image: ${errorMessage}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [view]: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, view: 'front' | 'side' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        alert('Image size should be less than 4MB');
        return;
      }
      handleImageUpload(file, view);
    }
  };

  async function createKey() {
    if (!motorName.trim()) {
      alert("Please enter a motor name");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create API Key
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: motorName }),
      });
      const data = await res.json();

      if (res.ok) {
        setJustCreated({ key: data.key, id: data.id });
        
        // Step 2: Upload motor hardware specs
        await uploadMotorSpecs(data.id);
        
        resetMotorForm();
        await load();
      } else {
        alert(`Error: ${data.error ?? "Failed to create API key"}`);
      }
    } catch (error) {
      alert("Error creating API key");
    } finally {
      setLoading(false);
    }
  }

  async function uploadMotorSpecs(apiKeyId: string) {
    try {
      const hardwareSpecsData = {
        apiKeyId: apiKeyId,
        name: motorName,
        description: description || null,
        monthlyPrice: monthlyPrice || null,
        fullyPaidPrice: fullyPaidPrice || null,
        frontView: frontView || null,
        sideView: sideView || null,
        backView: backView || null,
      };

      const res = await fetch("/api/motor-specs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(hardwareSpecsData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to upload" }));
        alert(`Warning: API key created but specs upload failed: ${errorData.error ?? "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Warning: API key created but failed to save hardware specifications");
    }
  }

  function resetMotorForm() {
    setMotorName("");
    setDescription("");
    setMonthlyPrice("");
    setFullyPaidPrice("");
    setFrontView("");
    setSideView("");
    setBackView("");
  }

  async function load() {
    try {
      const res = await fetch("/api/keys", { 
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Failed to load keys: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
              API Keys & Motors
            </h1>
            <p className="text-gray-300 text-lg ml-1">
              Create API keys and upload motor details in one place
            </p>
          </div>
          <a href="/docs">
            <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
              View API Documentation
            </button>
          </a>
        </div>

        {/* Create Key & Motor Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex flex-row items-center justify-between p-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-700">
            <div className="space-y-2">
              <h2 className="text-2xl text-white flex items-center gap-3 font-semibold">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-lg flex items-center justify-center border border-orange-500/40">
                  <Plus className="h-4 w-4 text-orange-400" />
                </div>
                Create New Motor & API Key
              </h2>
              <p className="text-gray-400 text-lg">
                Add your motor details and generate an API key
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
            {/* Motor Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Motor Name *</label>
              <input
                placeholder="e.g., Yamaha NMAX 155"
                value={motorName}
                onChange={(e) => setMotorName(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none backdrop-blur-sm transition"
              />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

            {/* Motor Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Bike className="h-6 w-6 text-orange-400" />
                <h3 className="text-xl font-semibold text-white">Motor Details</h3>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  placeholder="Describe the motor..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition h-24 resize-none"
                />
              </div>

              {/* Images Upload */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <Upload className="h-4 w-4 text-orange-500" />
                  Upload Images
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Front View */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Front View</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'front')}
                        className="hidden"
                        id="front-upload"
                        disabled={uploadingImages.front}
                      />
                      <label
                        htmlFor="front-upload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                          frontView
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
                        } ${uploadingImages.front ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {uploadingImages.front ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
                            <p className="text-sm text-gray-400">Uploading...</p>
                          </div>
                        ) : frontView ? (
                          <img src={frontView} alt="Front" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Side View */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Side View</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'side')}
                        className="hidden"
                        id="side-upload"
                        disabled={uploadingImages.side}
                      />
                      <label
                        htmlFor="side-upload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                          sideView
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
                        } ${uploadingImages.side ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {uploadingImages.side ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
                            <p className="text-sm text-gray-400">Uploading...</p>
                          </div>
                        ) : sideView ? (
                          <img src={sideView} alt="Side" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Back View */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Back View</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'back')}
                        className="hidden"
                        id="back-upload"
                        disabled={uploadingImages.back}
                      />
                      <label
                        htmlFor="back-upload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                          backView
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
                        } ${uploadingImages.back ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {uploadingImages.back ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
                            <p className="text-sm text-gray-400">Uploading...</p>
                          </div>
                        ) : backView ? (
                          <img src={backView} alt="Back" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-white">Payment Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Monthly Price</label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={monthlyPrice}
                      onChange={(e) => setMonthlyPrice(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Fully Paid Price</label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={fullyPaidPrice}
                      onChange={(e) => setFullyPaidPrice(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                    />
                  </div>
                </div>
              </div>
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
                  <th className="text-gray-200 font-semibold py-4 px-6 text-left">Motor Name</th>
                  <th className="text-gray-200 font-semibold py-4 px-6 text-left">Key</th>
                  <th className="text-gray-200 font-semibold py-4 px-6 text-left">Created</th>
                  <th className="text-gray-200 font-semibold py-4 px-6 text-left">Status</th>
                  <th className="text-right text-gray-200 font-semibold py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(row => !row.revoked).map((row, index) => (
                  <tr key={row.id} className="border-gray-700 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-200">
                          {row.hardwareSpec?.motorName || row.name || <span className="text-gray-500 italic">Motor #{index + 1}</span>}
                        </span>
                        {row.hardwareSpec?.description && (
                          <span className="text-xs text-gray-400 line-clamp-1">{row.hardwareSpec.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <code className="font-mono text-gray-300 bg-gray-700/30 rounded-lg py-2 px-3 text-sm inline-block">
                        {formatKeyDisplay(row.masked)}
                      </code>
                    </td>
                    <td className="text-gray-300 py-4 px-6 text-sm">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    </td>
                    <td className="text-right py-4 px-6">
                      <button
                        onClick={() => revokeKey(row.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105"
                      >
                        <XCircle className="h-4 w-4 inline mr-1" />
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {items.filter(row => !row.revoked).length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-lg text-gray-400 py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-700/30 rounded-2xl flex items-center justify-center">
                          <KeyRound className="h-8 w-8 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">No Active API Keys</p>
                          <p className="text-sm text-gray-500">Create your first motor and API key to get started</p>
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
            💡 <span className="font-semibold text-orange-400">Pro Tip:</span> Keep your API keys secure and never share them publicly. Enter a motor name to create both the motor entry and its associated API key.
          </div>
        </div>
      </div>
    </main>
  );
}