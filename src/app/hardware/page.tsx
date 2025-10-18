"use client";

import { Bike, Upload, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

type MotorData = {
  apiKeyId: string;
  motorName: string;
  description: string;
  monthlyPrice: string;
  fullyPaidPrice: string;
  frontView: string;
  sideView: string;
  backView: string;
};

export default function MotorUploadPage() {
  const [motorData, setMotorData] = useState<MotorData>({
    apiKeyId: "",
    motorName: "",
    description: "",
    monthlyPrice: "",
    fullyPaidPrice: "",
    frontView: "",
    sideView: "",
    backView: "",
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({
    front: false,
    side: false,
    back: false,
  });

  const updateField = (field: keyof MotorData, value: string) => {
    setMotorData(prev => ({ ...prev, [field]: value }));
  };

  // Image upload using UTApi server-side approach
  const handleImageUpload = async (file: File, view: 'front' | 'side' | 'back') => {
    setUploadingImages(prev => ({ ...prev, [view]: true }));
    
    try {
      // Use a separate API route for uploading
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
      console.log('Upload result:', result);

      const fileUrl = result.url;

      if (!fileUrl) {
        throw new Error('No URL in response');
      }

      // Update the corresponding view URL
      const fieldMap = {
        front: 'frontView',
        side: 'sideView',
        back: 'backView'
      };
      
      updateField(fieldMap[view] as keyof MotorData, fileUrl);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [view]: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, view: 'front' | 'side' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert('Image size should be less than 4MB');
        return;
      }
      
      handleImageUpload(file, view);
    }
  };

  const handleSubmit = async () => {
    if (!motorData.apiKeyId.trim()) {
      alert("Please enter API Key ID");
      return;
    }
    if (!motorData.motorName.trim()) {
      alert("Please enter motor name");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/motors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(motorData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setMotorData({
            apiKeyId: "",
            motorName: "",
            description: "",
            monthlyPrice: "",
            fullyPaidPrice: "",
            frontView: "",
            sideView: "",
            backView: "",
          });
        }, 3000);
      } else {
        alert(`Error: ${data.error ?? "Failed to upload motor"}`);
      }
    } catch (error) {
      console.error("Error uploading motor:", error);
      alert("Error uploading motor");
    } finally {
      setUploading(false);
    }
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
                <Bike className="h-8 w-8 text-orange-400" />
              </div>
              Upload Motor
            </h1>
            <p className="text-gray-300 text-lg ml-1">
              Add new motorcycle with images and specifications
            </p>
          </div>
          <a href="/keys">
            <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
              <ArrowLeft className="h-5 w-5" />
              Back to Keys
            </button>
          </a>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-xl p-6 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-green-200 font-semibold text-lg">Motor uploaded successfully!</p>
              <p className="text-green-300 text-sm">Your motor has been added to the database.</p>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-b border-gray-700">
            <h2 className="text-2xl text-white flex items-center gap-3 font-semibold mb-2">
              <Upload className="h-6 w-6 text-orange-400" />
              Motor Details
            </h2>
            <p className="text-gray-400 text-lg">
              Fill in all the details and upload images
            </p>
          </div>

          <div className="space-y-8 p-8">
            {/* API Key ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">API Key ID *</label>
              <input
                placeholder="Enter API Key ID (e.g., abc123-def456-...)"
                value={motorData.apiKeyId}
                onChange={(e) => updateField('apiKeyId', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
              />
              <p className="text-xs text-gray-500">Get this from the API Keys page</p>
            </div>

            {/* Motor Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Motor Name *</label>
              <input
                placeholder="e.g., Yamaha NMAX 155"
                value={motorData.motorName}
                onChange={(e) => updateField('motorName', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Description</label>
              <textarea
                placeholder="Describe the motor..."
                value={motorData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition h-24 resize-none"
              />
            </div>

            {/* Images Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bike className="h-5 w-5 text-orange-500" />
                Upload Images
              </h3>
              
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
                        motorData.frontView
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
                      } ${uploadingImages.front ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingImages.front ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
                          <p className="text-sm text-gray-400">Uploading...</p>
                        </div>
                      ) : motorData.frontView ? (
                        <img src={motorData.frontView} alt="Front" className="w-full h-full object-cover rounded-lg" />
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
                        motorData.sideView
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
                      } ${uploadingImages.side ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingImages.side ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
                          <p className="text-sm text-gray-400">Uploading...</p>
                        </div>
                      ) : motorData.sideView ? (
                        <img src={motorData.sideView} alt="Side" className="w-full h-full object-cover rounded-lg" />
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
                        motorData.backView
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
                      } ${uploadingImages.back ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingImages.back ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
                          <p className="text-sm text-gray-400">Uploading...</p>
                        </div>
                      ) : motorData.backView ? (
                        <img src={motorData.backView} alt="Back" className="w-full h-full object-cover rounded-lg" />
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
              <h3 className="text-lg font-semibold text-white">Payment Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Monthly Price</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={motorData.monthlyPrice}
                    onChange={(e) => updateField('monthlyPrice', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Fully Paid Price</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={motorData.fullyPaidPrice}
                    onChange={(e) => updateField('fullyPaidPrice', e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white flex items-center gap-2 px-8 py-3 rounded-lg shadow-lg hover:shadow-orange-600/50 transition-all duration-300 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                <Upload className="h-5 w-5" />
                {uploading ? "Uploading..." : "Upload Motor"}
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

        <div className="text-center p-8 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl rounded-lg border border-gray-700">
          <div className="text-gray-300 text-lg leading-relaxed">
            <span className="font-semibold text-orange-400">Note:</span> All uploaded images are stored securely via UploadThing. Make sure to fill in the API Key ID from your keys page.
          </div>
        </div>
      </div>
    </main>
  );
}