
// 'use client';

// import { LogOut, User, Video } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// export default function Sidebar({ darkMode, handleLogout }) {
//    const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [profilePic, setProfilePic] = useState('');

//    useEffect(() => {
//     const storedEmail = sessionStorage.getItem('email');
//     if (storedEmail) {
//       setEmail(storedEmail);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchInvtData = async () => {
//       try {
//         const storedEmail = sessionStorage.getItem('email');
//         if (!storedEmail) return;

//         const res = await fetch(`/api/investor_profile?email=${storedEmail}`);
//         if (!res.ok) return;

//         const data = await res.json();
//         const investor = data.investor;

//         setName(investor.fullName);
//         setProfilePic(investor.photo || '');
//       } catch (error) {
//         console.error('Error fetching investor data:', error);
//       }
//     };

//     fetchInvtData();
//   }, []);

 

//   return (
//     <div className={`w-64 h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col justify-between p-6 overflow-y-hidden`}>
     
//       <ul className="space-y-6 text-lg">
//           <h2 className="text-2xl font-bold mb-10">Dashboard</h2>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <Link href={`/investor_dashboard?email=${encodeURIComponent(email)}`}>
//             Proposes
//           </Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <Link href={`/proposals?email=${encodeURIComponent(email)}`}>All Proposals</Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <Video size={20} />
//           <Link href="/investor_consultations">Consultations</Link>
//         </li>
//         <li className="flex items-center gap-2 hover:text-blue-500">
//           <User size={20} />
//           <Link href="/investor_editprofile">Edit Profile</Link>
//         </li>
        
//       </ul>
//        <div>
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

import { BrainCircuit, Files, LogOut, User, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar({ handleLogout }) {
   const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');

   useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const fetchInvtData = async () => {
      try {
        const storedEmail = sessionStorage.getItem('email');
        if (!storedEmail) return;

        const res = await fetch(`/api/investor_profile?email=${storedEmail}`);
        if (!res.ok) return;

        const data = await res.json();
        const investor = data.investor;

        setName(investor.fullName);
        setProfilePic(investor.photo || '');
      } catch (error) {
        console.error('Error fetching investor data:', error);
      }
    };

    fetchInvtData();
  }, []);

 

  return (
<div className="w-64 h-screen shadow-lg flex flex-col justify-between p-6 overflow-hidden fixed top-0 left-0">
     
      <ul className="space-y-6 text-lg">
          <h2 className="text-2xl font-bold mb-10">Innovest 🚀</h2>
        <li className="flex items-center gap-2 hover:text-blue-500">
 <BrainCircuit size={20} />
           <Link href={`/investor_dashboard?email=${encodeURIComponent(email)}`}>
            AI Recommended 
          </Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
           <Files size={20} />
          <Link href={`/proposals?email=${encodeURIComponent(email)}`}>All Proposals</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <Video size={20} />
          <Link href="/investor_consultations">Consultations</Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500">
          <User size={20} />
          <Link href="/investor_editprofile">Edit Profile</Link>
        </li>
        
      </ul>
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