"use client";

import { KeyRound, Bike, Code2, Zap, Shield, Globe, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-orange-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gray-700/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="px-6 lg:px-8 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 rounded-full px-4 py-2">
                <Zap className="h-4 w-4 text-orange-400" />
                <span className="text-orange-300 text-sm font-medium">Powerful Motor Management API</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent leading-tight">
                Manage Your Motors
                <br />
                with Simple API
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Build powerful motor management applications with our easy-to-use API. Upload images, manage inventory, and integrate seamlessly.
              </p>

             
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 lg:px-8 py-24 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Why Choose Motor API?
              </h2>
              <p className="text-xl text-gray-400">
                Everything you need to manage your motor inventory
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-600/10">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl flex items-center justify-center border border-orange-500/40 mb-6">
                  <KeyRound className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Secure Authentication</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  API key-based authentication ensures your data is protected. Generate and manage keys with ease.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-600/10">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl flex items-center justify-center border border-orange-500/40 mb-6">
                  <Bike className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Motor Management</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Upload motor details, images, pricing, and descriptions. Full CRUD operations supported.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-600/10">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl flex items-center justify-center border border-orange-500/40 mb-6">
                  <Code2 className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Developer Friendly</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  RESTful API with clear documentation. Easy integration with any programming language.
                </p>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </main>
  );
}