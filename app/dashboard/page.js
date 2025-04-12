'use client';

import Link from 'next/link';
import {  Bell } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import Sidebar from '../sidebar/page';

export default function DashboardPage() {
  const router = useRouter(); 

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 

    router.push('/'); 
  };

  return (
    <div className={`min-h-screen flex`}>
      
      {/* Sidebar */}
      <Sidebar  handleLogout={handleLogout} />


      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back, Innovator! 🚀</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/template"
              className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition"
            >
              Template
            </Link>

            <Bell size={24} className="text-gray-600 dark:text-white cursor-pointer" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Proposals</h2>
            <p className="text-3xl font-bold">8</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Upcoming Consultations</h2>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>

        {/* Steps Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Steps to Get Started</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to the <strong>Propose</strong> page and submit your startup idea with required files.</li>
            <li>View and Edit your submissions from the <strong>View & Edit</strong> section.</li>
            <li>Grab a chance to find investors by participating in scheduled <strong>Consultations</strong> via Google Meet.</li>
            <li>Collect <strong>Feedback</strong> from investors and refine your pitch.</li>
            <li>Update your <strong>Profile</strong> as needed to keep things fresh and professional.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
