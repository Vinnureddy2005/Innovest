'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../investor_sidebar/page'; // create investor_sidebar if needed

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
    <div className="flex min-h-screen bg-gradient-to-r from-white to-gray-100 text-gray-800">
      <Sidebar handleLogout={handleLogout} />

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
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{m.startupName}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Client Name:</strong> {m.client_name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Client:</strong> {m.client_mail}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Date:</strong>{' '}
                  {new Date(m.startDateTime).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Time:</strong>{' '}
                  {new Date(m.startDateTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <a
                  href={m.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Join Meeting
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
