'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../client_sidebar/page';

export default function DashboardPage() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email');

  const [clientMail, setClientMail] = useState('');

  const [meetings, setMeetings] = useState([]);
  const [proposalsCount, setProposalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  console.log(loading)

  // ✅ Set email to sessionStorage in a safe useEffect
  useEffect(() => {
    if (emailFromQuery) {
      sessionStorage.setItem('email', emailFromQuery);
      setClientMail(emailFromQuery);
    } else {
      const stored = sessionStorage.getItem('email');
      if (stored) setClientMail(stored);
    }
  }, [emailFromQuery]);

  // ✅ Fetch meetings
  useEffect(() => {
    if (!clientMail) return;

    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/get-client-meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_mail: clientMail }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch meetings');
        setMeetings(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [clientMail]);

  // ✅ Fetch proposals
  useEffect(() => {
    if (!clientMail) return;

    fetch(`/api/propose_email/${clientMail}`)
      .then(res => res.json())
      .then(data => {
        console.log("Proposals data:", data); 
        setProposalCount(data.length);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch proposals:', err);
        setLoading(false);
      });
  }, [clientMail]);

 const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchInvestedCount = async () => {
      try {
        console.log("Fetching invested count for:", clientMail);

        const res = await fetch("/api/invested_count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientEmail:clientMail }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch count");
        }

        const data = await res.json();
        setCount(data.investedCount);
      } catch (error) {
        console.error("Error fetching invested count:", error);
        setCount("Error");
      } finally {
        setLoading(false);
      }
    };

    if (clientMail) {
      fetchInvestedCount();
    }
  }, [clientMail]);

  const handleLogout = () => {
    sessionStorage.removeItem('email');
    localStorage.removeItem('authToken'); 
    router.push('/'); 
  };
  

  return (
    <div className={`min-h-screen flex`}>
      {/* Sidebar */}
      <Sidebar email={clientMail} handleLogout={handleLogout} />

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

            {/* <Bell size={24} className="text-gray-600 dark:text-white cursor-pointer" /> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
  <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-2xl shadow-lg transition transform hover:scale-[1.02] hover:shadow-xl">
    <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-white mb-1">Total Proposals</h2>
    <p className="text-4xl font-bold text-blue-700 dark:text-white">{proposalsCount}</p>
  </div>

<div className="bg-violet-100 dark:bg-violet-800 p-6 rounded-2xl shadow-lg transition transform hover:scale-[1.02] hover:shadow-xl">
    <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-white mb-1">Your Startup Investments</h2>
    <p className="text-4xl font-bold text-purple-700 dark:text-white">{count}</p>
  </div>

  <div className="bg-green-100 dark:bg-green-800 p-6 rounded-2xl shadow-lg transition transform hover:scale-[1.02] hover:shadow-xl">
    <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-white mb-1">Upcoming Consultations</h2>
    <p className="text-4xl font-bold text-green-700 dark:text-white">{meetings.length}</p>
  </div>
</div>


        {/* Steps Section */}
        <div className="bg-indigo-100 dark:bg-indigo-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Steps to Get Started</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to the <strong>Propose</strong> page and submit your startup idea with required file by downloading the template .</li>
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
