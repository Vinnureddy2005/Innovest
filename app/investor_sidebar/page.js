
'use client';

import { LogOut, User, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar({ darkMode, handleLogout }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className={`w-64 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className="text-2xl font-bold mb-10">Dashboard</h2>
      <ul className="space-y-6 text-lg">
        <li className="flex items-center gap-2 hover:text-blue-500">
          <Link href={`/investor_dashboard?email=${encodeURIComponent(email)}`}>
            Proposes
          </Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <Link href="/proposals">All Proposals</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <Video size={20} />
          <Link href="/investor_consultations">Consultations</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <User size={20} />
          <Link href="/investor_editprofile">Edit Profile</Link>
        </li>
        <li
          className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </li>
      </ul>
    </div>
  );
}
