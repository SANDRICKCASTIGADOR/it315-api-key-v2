"use client";

import { Bike, CheckCircle, Shield, Zap, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-orange-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gray-700/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 lg:px-8 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent leading-tight">
                About MotoRide.Pro
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                We're building the future of motor management with powerful APIs and seamless integration.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  Built for Modern Developers
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Motor API is designed to make motor management simple and efficient. Whether you're building a marketplace, inventory system, or rental platform, our API has you covered.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Fast & Reliable</h4>
                      <p className="text-gray-400">High-performance API with 99.9% uptime guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Image Storage</h4>
                      <p className="text-gray-400">Secure cloud storage for all your motor images</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Easy Integration</h4>
                      <p className="text-gray-400">RESTful endpoints that work with any stack</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 lg:p-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">100%</p>
                      <p className="text-gray-400">Secure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">10ms</p>
                      <p className="text-gray-400">Average Response</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">Global</p>
                      <p className="text-gray-400">CDN Network</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-6 lg:px-8 py-24 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              We believe that managing motors should be simple, secure, and scalable. Our mission is to provide developers and businesses with the tools they need to build amazing motor management applications without worrying about infrastructure or complexity.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-3">Simple</h3>
                <p className="text-gray-400">Easy-to-use API that gets you started in minutes</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-3">Secure</h3>
                <p className="text-gray-400">Enterprise-grade security for your data</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-3">Scalable</h3>
                <p className="text-gray-400">Grows with your business needs</p>
              </div>
            </div>
          </div>
        </section>

       
      </div>
    </main>
  );
}