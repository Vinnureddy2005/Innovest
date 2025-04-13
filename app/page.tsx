
"use client";
import { Rocket } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";
import About from "./components/about";

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-[#f3d2b5] overflow-x-hidden">
      <div>
      <img 
  src="/images/home-1.png" 
  className="absolute bottom-20 right-4 md:right-10 w-3/4 sm:w-2/4 max-w-full h-auto object-contain opacity-90" 
/>

      </div>

      <nav className="flex flex-wrap justify-between items-center p-4 bg-transparent shadow-md">
        <div className="flex items-center space-x-3 text-3xl font-extrabold text-black">
          <Rocket className="w-8 h-8 text-black" />
          <span>Innovest</span>
        </div>
        <ul className="flex flex-wrap gap-6 text-gray-700 mt-4 md:mt-0">
          <li>
            <a href="#home" className="hover:text-gray-900">Home</a>
          </li>
          <li>
            <a href="#about" className="hover:text-gray-900">About</a>
          </li>
          <li>
            <a href="#works" className="hover:text-gray-900">Services</a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-900">Contact</a>
          </li>
          <li className="relative">
          <button 
            className="hover:text-gray-900 focus:outline-none" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Login ▾
          </button>

          {isDropdownOpen && (
            <div className="fixed top-14 left-[calc(100%-150px)] w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <a href="/login_client" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Client</a>
              <a href="/login_investor" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Investor</a>
              </div>
          )}
          </li>
        </ul>
      </nav>

      <div className="absolute top-40 left-10 md:left-40 w-11/12 md:w-1/3 font-serif">
        <h1 className="text-4xl font-bold">
          Connecting visionary startups with game-changing investors for growth beyond limits.
        </h1>
        <h3 className="text-xl absolute top-50 left-10">"Innovest : Where Innovation Meets Investment!"</h3>
      </div>

      <div className="flex flex-wrap gap-10 mt-[350px] ml-4 md:ml-[100px]">
        {/* Client Card */}
        <div className="bg-[#f9eee4c8] p-6 rounded-2xl shadow-lg w-full sm:w-[300px] text-center">
          <h2 className="text-2xl font-bold text-gray-800">For Clients</h2>
          <p className="text-gray-600 mt-5">
            Propose innovative startup ideas and get connected with the right investors.
          </p>
          <Link href="/signup_client">
          <button type="button" className="mt-4 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Get Started
          </button>
          </Link>
        </div>

        {/* Investor Card */}
        <div className="bg-[#f9eee4c8] p-6 rounded-2xl shadow-lg w-full sm:w-[300px] text-center">
          <h2 className="text-xl font-bold text-gray-800">For Investors</h2>
          <p className="text-gray-600 mt-2">
            Explore a diverse range of promising startups to make impactful, game-changing investments.
          </p>
          <Link href="/signup_investor">
          <button className="mt-4 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Explore</button>
          </Link>
        </div>
      </div>

      <About />

      <style jsx>{`
        .clip-trapezium {
          clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
}