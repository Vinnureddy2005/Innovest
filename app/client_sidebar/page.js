// components/Sidebar.js
'use client';

import { FilePlus2, ListTodo, LogOut, MessageCircle, User, Video } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ darkMode, handleLogout }) {
  // const email = sessionStorage.getItem('email'); 
  // console.log("sidebar",email)

  return (
    <div className={`w-64 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className="text-2xl font-bold mb-10">Dashboard</h2>
      <ul className="space-y-6 text-lg">
        <li className="flex items-center gap-2 hover:text-blue-500">
          <FilePlus2 size={20} />
          <Link href="/propose">Propose</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <ListTodo size={20} />
          <Link href="/viewPreviousProposals">View & Edit</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <MessageCircle size={20} />
          <Link href="/feedback">Feedback</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <Video size={20} />
          <Link href="/consultations">Consultations</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <User size={20} />
          <Link href="/edit-profile">Edit Profile</Link>
        </li>
        <li className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </li>
      </ul>
    </div>
  );
}
