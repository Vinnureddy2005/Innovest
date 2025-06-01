'use client';

import { useEffect, useState } from 'react';
import {
  FaClipboardList,
  FaLightbulb,
  FaStar,
} from 'react-icons/fa';
import Sidebar from '../client_sidebar/page';
export default function ClientFeedbackPage() {
  const [email, setEmail] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    async function fetchFeedbacks() {
      try {
        const res = await fetch(`/api/client_feedback?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) setFeedbacks(data.feedbacks);
        else console.error('Error:', data.error);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, [email]);

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg font-medium">
        Loading feedbacks...
      </div>
    );
  }

  if (!email) {
    return (
      <div className="p-6 text-left text-red-600 font-semibold">
        No email found in session storage.
      </div>
    );
  }

  return (
  <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex-1 p-6">       <h2 className="text-3xl font-semibold mb-8 border-b pb-2 border-gray-300">
            Your Feedbacks
          </h2>

    <div className="p-4 grid gap-4 md:grid-cols-3">
      {feedbacks.map((fb) => (
        <div
          key={fb._id}
          className="bg-blue-100 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <img
                src={fb.Invphoto|| '/default-profile.png'}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-base font-semibold text-gray-800">
                  {fb.investorName}
                </p>
                <p className="text-sm text-gray-500">
                  {fb.date}
                </p>
              </div>
                <div className="w-28 text-right">{renderStars(parseInt(fb.overallRating))}

</div>
            </div>
            
          </div>

          <p className="text-gray-700 text-m font-bold italic mb-4">
            Startup:{' '}
            <span className="text-black-600 font-medium">
              {fb.startupName}
            </span>
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <FaLightbulb className="mt-1 text-gray-500" />
              <div>
                <strong>Clarity:</strong> {fb.clarity}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaClipboardList className="mt-1 text-gray-500" />
              <div>
                <strong>Feasibility:</strong> {fb.feasibility}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaStar className="mt-1 text-gray-500" />
              <div>
                <strong>Uniqueness:</strong> {fb.uniqueness}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaLightbulb className="mt-1 text-gray-500" />
              <div>
                <strong>Suggestions:</strong>{' '}
                {fb.improvementSuggestions || 'None'}
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Contact:{' '}
            <a
              href={`mailto:${fb.investorEmail}`}
              className="text-blue-600 hover:underline"
            >
              {fb.investorEmail}
            </a>
          </div>
        </div>
      ))}
    </div>
    </div>
    </div>
  );
}
