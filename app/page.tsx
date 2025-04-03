"use client";
import { useState } from "react";
export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-r from-cyan-100 to-[#f3d2b5] clip-trapezium'>
      <nav className="flex justify-between items-center p-4 bg-transparent shadow-md">
  <div className="text-2xl font-bold text-gray-800">My Website</div>
  <ul className="flex gap-6 text-gray-700 mr-[30]">
    <li><a href="#home" className="hover:text-gray-900">Home</a></li>
    <li><a href="#about" className="hover:text-gray-900">About</a></li>
    <li><a href="#services" className="hover:text-gray-900">Services</a></li>
    <li><a href="#contact" className="hover:text-gray-900">Contact</a></li>
    <li className="relative">
          <button 
            className="hover:text-gray-900 focus:outline-none" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Login ▾
          </button>

          {isDropdownOpen && (
            <div className="fixed top-14 left-[calc(100%-150px)] w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <a href="/login/client" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Client</a>
              <a href="/login/investor" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Investor</a>
              </div>
          )}
          </li>
  </ul>
</nav>

      <div className="absolute top-40 left-40 w-1/3 font-serif">
      <h1 className="text-4xl font-bold ">
      Connecting visionary startups with game-changing investors for growth beyond limits.
      </h1>
      <h3 className="text-xl absolute top-50 left-30">"Where Innovation Meets Investment!" </h3>
      </div>
      <div >
        <img src="/images/home-1.png"  className="absolute bottom-20 right-10 w-2/4 object-contain opacity-90" />
      </div>
      <div className="flex  gap-10 mt-[350px] ml-[100px]"> 
        {/* Client Card */}
        <div className="bg-[#f9eee4c8] p-6 rounded-2xl shadow-lg w-[300px] text-center">
          <h2 className="text-2xl font-bold text-gray-800">For Clients</h2>
          <p className="text-gray-600 mt-5">Propose innovative startup ideas and get connected with the right investors.</p>
          <button className="mt-4 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Get Started</button>
        </div>

        {/* Investor Card */}
        <div className="bg-[#f9eee4c8] p-6 rounded-2xl shadow-lg w-[300px] text-center">
          <h2 className="text-xl font-bold text-gray-800">For Investors</h2>
          <p className="text-gray-600 mt-2">Explore a diverse range of promising startups to make impactful, game-changing investments.</p>
          <button className="mt-4 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Explore</button>
        </div>
      </div>
      <style jsx>{`
        .clip-trapezium {
          clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
}
