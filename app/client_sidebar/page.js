
// 'use client';

// import {
//   FilePlus2,
//   LayoutDashboard,
//   ListTodo,
//   LogOut,
//   MessageCircle,
//   User,
//   Video,
// } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// export default function Sidebar({ darkMode, handleLogout }) {
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [profilePic, setProfilePic] = useState('');

//   useEffect(() => {
//     const fetchClientData = async () => {
//       try {
//         const storedEmail = sessionStorage.getItem('email');
//         if (!storedEmail) return;

//         const res = await fetch(`/api/client_profile?email=${storedEmail}`);
//         if (!res.ok) return;

//         const data = await res.json();
//         const client = data.client;

//         setName(client.fullName);
//         setProfilePic(client.photo || '');
//       } catch (error) {
//         console.error('Error fetching client data:', error);
//       }
//     };

//     fetchClientData();
//   }, []);

//   useEffect(() => {
//     const storedEmail = sessionStorage.getItem('email');
//     if (storedEmail) setEmail(storedEmail);
//   }, []);

//   return (
//     <div className={`w-64 h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col justify-between p-6 overflow-y-hidden`}>
      
//       {/* Top Navigation */}
//       <ul className="space-y-6 text-lg">
//         <h2 className="text-2xl font-bold mb-10">Innovest🚀</h2>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <LayoutDashboard size={20} />
//           <Link href={`/client_dashboard?email=${encodeURIComponent(email)}`}>Dashboard</Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <FilePlus2 size={20} />
//           <Link href="/propose">Propose</Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <ListTodo size={20} />
//           <Link href="/viewPreviousProposals">View & Edit</Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <MessageCircle size={20} />
//           <Link href="/client_feedback">Feedback</Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <Video size={20} />
//           <Link href="/client_consultations">Consultations</Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <User size={20} />
//           <Link href="/client_editprofile">Edit Profile</Link>
//         </li>
//       </ul>

//       {/* Bottom Profile + Logout */}
//       <div>
//         <div className="flex items-center gap-4 mt-10 mb-4">
//           <img
//             src={profilePic || '/default-profile.png'}
//             alt="Profile"
//             className="w-12 h-12 rounded-full object-cover border"
//           />
//           <div className="text-md font-semibold break-all">
//             {name || 'User'}
//           </div>
//         </div>
//         <div
//           className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
//           onClick={handleLogout}
//         >
//           <LogOut size={20} />
//           Logout
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import {
  FilePlus2,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MessageCircle,
  User,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar({  handleLogout }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const storedEmail = sessionStorage.getItem('email');
        if (!storedEmail) return;

        const res = await fetch(`/api/client_profile?email=${storedEmail}`);
        if (!res.ok) return;

        const data = await res.json();
        const client = data.client;

        setName(client.fullName);
        setProfilePic(client.photo || '');
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) setEmail(storedEmail);
  }, []);

  return (
    <div className={`w-64 h-screen shadow-lg flex flex-col justify-between p-6 overflow-y-hidden`}>
      
      <ul className="space-y-6 text-lg">
        <h2 className="text-2xl font-bold mb-10">Innovest🚀</h2>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <LayoutDashboard size={20} />
          <Link href={`/client_dashboard?email=${encodeURIComponent(email)}`}>Dashboard</Link>
        </li>
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
          <Link href="/client_feedback">Feedback</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <Video size={20} />
          <Link href="/client_consultations">Consultations</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <User size={20} />
          <Link href="/client_editprofile">Edit Profile</Link>
        </li>
      </ul>

      {/* Bottom Profile + Logout */}
      <div>
        <div className="flex items-center gap-4 mt-10 mb-4">
          <img
            src={profilePic || '/default-profile.png'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div className="text-md font-semibold break-all">
            {name || 'User'}
          </div>
        </div>
        <div
          className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </div>
      </div>
    </div>
  );
}
