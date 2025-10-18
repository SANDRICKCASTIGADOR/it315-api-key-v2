"use client";

import { useState } from "react";
import { Bike, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
                Get in Touch
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Have questions about our API? We'd love to hear from you. Contact us and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Email */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 text-center hover:border-orange-500/50 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl flex items-center justify-center border border-orange-500/40 mx-auto mb-6">
                  <Mail className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Email</h3>
                <p className="text-gray-400">
                  <a href="mailto:support@motoride.pro" className="hover:text-orange-400 transition-colors">
                    support@motoride.pro
                  </a>
                </p>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 text-center hover:border-orange-500/50 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl flex items-center justify-center border border-orange-500/40 mx-auto mb-6">
                  <Phone className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Phone</h3>
                <p className="text-gray-400">
                  <a href="tel:+1234567890" className="hover:text-orange-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                </p>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 text-center hover:border-orange-500/50 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/40 to-orange-700/40 rounded-xl flex items-center justify-center border border-orange-500/40 mx-auto mb-6">
                  <MapPin className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Location</h3>
                <p className="text-gray-400">
                  123 Motor Street<br />
                  Metro Manila, PH
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-6 lg:px-8 py-24 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Send us a Message
              </h2>
              <p className="text-xl text-gray-400">
                Fill out the form below and we'll get back to you shortly.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Message *</label>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg py-3 px-4 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white py-4 rounded-lg shadow-xl hover:shadow-orange-600/50 transition-all duration-300 text-lg font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

      
      </div>
    </main>
  );
}