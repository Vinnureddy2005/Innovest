
"use client";
import React from "react";
import Works from "./works";
import Contact from "./contact";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 mt-11 font-sans">
      {/* About Section */}
      <section
        id="about"
className="px-4 sm:px-8 md:px-10 py-20 bg-[#f3e4d2]"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square w-[20rem] sm:w-[28rem] md:w-[36rem] mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-full overflow-hidden shadow-2xl">
            <img
              src="/images/about.png"
              alt="Startup and Investor"
              className="w-full h-full object-cover rounded-full transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-m font-bold text-gray-700 tracking-widest uppercase mb-2">
              Welcome to Innovest
            </h2>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              Empowering Startups & Connecting with Investors
            </h1>
            <p className="text-gray-600 text-base mb-6">
              We bridge the gap between bold ideas and visionary investors. Our platform is designed to support startups by giving them a space to present their ideas and refine them with expert feedback—while providing investors with AI-curated matches that align with their goals.
            </p>

            {/* Offerings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-800">
              <div>
                <h3 className="text-2xl font-semibold mb-2">What We Offer for Clients</h3>
                <ul className="text-lg space-y-2">
                  <li>✅ AI-driven investor matches</li>
                  <li>✅ Real-time consultations</li>
                  <li>✅ Platform to refine ideas</li>
                </ul>
              </div>
              <div className="sm:ml-4">
                <h3 className="text-2xl font-semibold mb-2">What We Offer for Investors</h3>
                <ul className="text-lg space-y-2">
                  <li>✅ Handpicked startup pitches</li>
                  <li>✅ Consultation scheduling</li>
                  <li>✅ Continuous engagement with startups</li>
                </ul>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-6">
              <Link href="/signup_client">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Join as a Startup
              </button>
              </Link>
              <Link href="/signup_investor">

              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Join as an Investor
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Works */}
      <Works />

      {/* Membership */}
      <section
        id="membership"
        className="px-4 sm:px-8 md:px-10 py-16 bg-[#f3e4d2]"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Membership Plans</h2>
        <div className="flex flex-col md:flex-row justify-center gap-10 max-w-6xl mx-auto">
          {/* Startup Clients */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-1/2 text-center">
            <h3 className="text-2xl font-bold mb-4">Startup Clients</h3>
            <p className="text-gray-600 mb-6">Access to expert investors and AI-driven matches</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
              <p className="text-lg font-medium">6 Months</p>
              <p className="text-xl font-bold text-blue-600">₹599</p>
              <p className="text-lg font-medium">1 Year</p>
              <p className="text-xl font-bold text-blue-600">₹999</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
              Join Now
            </button>
          </div>

          {/* Investors */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-1/2 text-center">
            <h3 className="text-2xl font-bold mb-4">Investors</h3>
            <p className="text-gray-600 mb-6">Curated startup suggestions and exclusive consultations</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
              <p className="text-lg font-medium">6 Months</p>
              <p className="text-xl font-bold text-green-600">₹1099</p>
              <p className="text-lg font-medium">1 Year</p>
              <p className="text-xl font-bold text-green-600">₹1999</p>
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded-lg">
              Join Now
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <Contact />
    </div>
  );
}
