"use client";
import { Rocket } from "lucide-react";
import Image from 'next/image'; 
import Link from 'next/link';
import { useState ,useEffect} from "react";
import About from "./about";

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

 const handleScrollTo = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
   useEffect(() => {
    const handleScroll = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDropdownOpen]); 
 return (
  <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-[#f3d2b5] overflow-x-hidden">
    
    {/* Navbar */}
    <nav className="flex flex-wrap justify-between items-center p-4 bg-transparent shadow-md z-50 relative">
      <div className="flex items-center space-x-3 text-3xl font-extrabold text-black">
        <Rocket className="w-8 h-8 text-black" />
        <span>Innovest</span>
      </div>
      <ul className="flex flex-wrap gap-6 text-gray-700 mt-4 md:mt-0">
        <li><button onClick={() => handleScrollTo('home')} className="hover:text-gray-900">Home</button></li>
        <li><button onClick={() => handleScrollTo('about')} className="hover:text-gray-900">About</button></li>
        <li><button onClick={() => handleScrollTo('works')} className="hover:text-gray-900">Services</button></li>
        <li><button onClick={() => handleScrollTo('contact')} className="hover:text-gray-900">Contact</button></li>
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

    {/* Hero Section with text + image */}
<section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 pt-10 md:pt-16 pb-10">
      
      {/* Text */}
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-black mb-6">
          Connecting visionary startups with game-changing investors for growth beyond limits.
        </h1>
        <h3 className="text-xl ml-50 font-medium text-gray-800 italic">
          "Innovest : Where Innovation Meets Investment!"
        </h3>

        {/* Cards Below Text */}
        <div className="flex flex-col sm:flex-row gap-6 mt-10">
          {/* Client Card */}
          <div className="bg-[#f9eee4c8] p-6 rounded-2xl shadow-lg w-full sm:w-[300px] text-center">
            <h2 className="text-2xl font-bold text-gray-800">For Clients</h2>
            <p className="text-gray-600 mt-5">
              Propose innovative startup ideas and get connected with the right investors.
            </p>
            <Link href="/signup_client">
              <button className="mt-4 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
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
              <button className="mt-4 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Explore
              </button>
            </Link>
          </div>
        </div>
      </div>
<div className="md:w-1/2 flex justify-center -mt-12 md:-mt-10">
      {/* Hero Image */}
      <Image 
  src="/images/home-1.png" 
  alt="Home image"
  className="w-full max-w-[700px] h-auto object-contain opacity-90"
  width={1000}
  height={800}
  priority
/>
</div>


    </section>

    {/* About Section */}
    <About />
  </div>
);

}
