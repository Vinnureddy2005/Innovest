'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../investor_sidebar/page';

export default function InvestorMeetingsPage() {
  const router = useRouter();
  const investorEmail = typeof window !== 'undefined' ? sessionStorage.getItem('email') : '';

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!investorEmail) return;

    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/get-investor-meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ investor_email: investorEmail }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch meetings');
        setMeetings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [investorEmail]);

  

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
  
       <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
      <Sidebar handleLogout={handleLogout} />
<main className="flex-1 p-6 md:ml-64">
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 border-b pb-2 border-gray-300">
            Meetings with Startups
          </h2>

          {loading && <p className="text-center text-blue-500">Loading meetings...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && meetings.length === 0 && (
            <p className="text-center text-gray-600">No meetings scheduled yet.</p>
          )}

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {meetings.map((m, idx) => (
    <div
      key={idx}
      className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200"
    >
      {/* Header with Profile and Name */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={m.clientphoto || "/images/no-profile.png"}
          alt={m.startupName}
          className="w-14 h-14 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{m.startupName}</h3>
          <p className="text-sm text-gray-500">{m.client_name}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p><strong>Email:</strong> {m.client_mail}</p>
        <p>
          <strong>Date:</strong>{' '}
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
            {new Date(m.startDateTime).toLocaleDateString()}
          </span>
        </p>
        <p>
          <strong>Time:</strong>{' '}
          {new Date(m.startDateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Action Button */}
      <a
        href={m.meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
      >
        Join Meeting
      </a>
    </div>
  ))}
</div>

        </div>
      </div>
      </main>
    </div>
  );
}
