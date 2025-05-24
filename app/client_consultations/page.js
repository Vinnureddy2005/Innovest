


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
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-4"
    >
      {/* Top Section: Photo + Startup Name */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={m.invphoto || "/images/no-profile.png"}
          alt={m.client_name}
          className="w-14 h-14 rounded-full object-cover border border-gray-300"
        />
        <h3 className="text-lg font-semibold text-gray-800">{m.startupName}</h3>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-700 space-y-1 mb-4">
        <p><span className="font-medium">Investor:</span> {m.client_name}</p>
        <p><span className="font-medium">Email:</span> {m.client_mail}</p>
        <p><span className="font-medium">LinkedIn:</span> <a href={m.linkedIn} className="text-blue-600 hover:underline" target="_blank">{m.linkedIn}</a></p>
        <p><span className="font-medium">Date:</span> {new Date(m.startDateTime).toLocaleDateString()}</p>
        <p><span className="font-medium">Time:</span> {new Date(m.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      {/* CTA */}
      <a
        href={m.meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
