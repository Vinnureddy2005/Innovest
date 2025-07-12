// app/client_dashboard/DashboardContent.tsx
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar1 from '../components/Sidebar1';

// change name here
export default function DashboardContent() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email');

  const [clientMail, setClientMail] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [proposalsCount, setProposalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (emailFromQuery) {
      sessionStorage.setItem('email', emailFromQuery);
      setClientMail(emailFromQuery);
    } else {
      const stored = sessionStorage.getItem('email');
      if (stored) setClientMail(stored);
    }
  }, [emailFromQuery]);

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
      }catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Unknown error", err);
        }
      }
       finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [clientMail]);

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
        const res = await fetch("/api/invested_count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientEmail: clientMail }),
        });

        if (!res.ok) throw new Error("Failed to fetch count");

        const data = await res.json();
        setCount(data.investedCount);
      } catch (error) {
        console.error("Error fetching invested count:", error);
        setCount(0);
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
      <Sidebar1  handleLogout={handleLogout} />
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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-100 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition">
            <h2 className="text-xl font-semibold">Total Proposals</h2>
            <p className="text-4xl font-bold text-blue-700">{proposalsCount}</p>
          </div>
          <div className="bg-violet-100 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition">
            <h2 className="text-xl font-semibold">Startup Investments</h2>
            <p className="text-4xl font-bold text-purple-700">{count}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition">
            <h2 className="text-xl font-semibold">Upcoming Consultations</h2>
            <p className="text-4xl font-bold text-green-700">{meetings.length}</p>
          </div>
        </div>

        <div className="bg-indigo-100 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Steps to Get Started</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Submit your startup idea in the <strong>Propose</strong> page.</li>
            <li>Edit submissions in <strong>View & Edit</strong>.</li>
            <li>Participate in <strong>Consultations</strong> via Google Meet.</li>
            <li>Collect <strong>Feedback</strong> from investors.</li>
            <li>Update your <strong>Profile</strong> regularly.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
