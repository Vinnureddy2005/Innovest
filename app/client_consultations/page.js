


'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../client_sidebar/page';

export default function ClientMeetingsPage() {
  const router = useRouter();
  const clientMail = typeof window !== 'undefined' ? sessionStorage.getItem('email') : '';

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [clientMail]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 border-b pb-2 border-gray-300">
            Your Scheduled Meetings
          </h2>

          {loading && (
            <div className="text-center text-lg text-blue-600">Loading meetings...</div>
          )}

          {error && (
            <div className="text-center text-red-600 font-medium">{error}</div>
          )}

          {!loading && meetings.length === 0 && (
            <p className="text-center text-gray-600">No meetings found.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{m.startupName}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Investor:</strong> {m.investor_name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Email:</strong> {m.investor_email}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>LinkedIn:</strong> {m.linkedIn}
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
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
