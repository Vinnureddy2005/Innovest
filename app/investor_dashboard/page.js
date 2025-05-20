"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardPage from "../investor_sidebar/page";

const Dashboard = () => {
  const [recommendedStartups, setRecommendedStartups] = useState([]);
  const [cfRecommendedStartups, setCFRecommendedStartups] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState({});
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [likedStartups, setLikedStartups] = useState(new Set());
  const [investedStartups, setInvestedStartups] = useState(new Set());

useEffect(() => {
    if (!email) return;
    sessionStorage.setItem('email', email);

    const fetchRecommendedStartups = async () => {
      try {
        const response = await fetch(`/api/recommendations?email=${email}`);
        const data = await response.json();
        setRecommendedStartups(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendedStartups();
  }, [email]);
 
useEffect(() => {
  if (!email) return;
 sessionStorage.setItem('email', email);
  const fetchCFRecommendedStartups = async () => {
    try {
      const response = await fetch(`/api/cf/?email=${email}`);
      const data = await response.json();
      console.log('Collaborative Filtering Startups:', data); // Log data to check
setCFRecommendedStartups(data.recommendations || []);    } catch (error) {
      console.error("Error fetching collaborative filtering recommendations:", error);
    }
  };

  fetchCFRecommendedStartups();
}, [email]); // Only rerun this effect when `email` changes

// This useEffect will run when `cfRecommendedStartups` changes
useEffect(() => {
  console.log("Updated cfRecommendedStartups:", cfRecommendedStartups);
}, [cfRecommendedStartups]); // This will log the updated state whenever it changes



  useEffect(() => {
    if (!email) return;
  
    const fetchInvestorResponses = async () => {
      try {
        const res = await fetch(`/api/investorResponse?email=${email}`);
        const data = await res.json();
  
        const likedSet = new Set();
        const investedSet = new Set();
  
        data.forEach((item) => {
          if (item.liked) likedSet.add(item.startupId); // FIX: use startupId
          if (item.invested) investedSet.add(item.startupId); // FIX: use startupId
        });
  
        setLikedStartups(likedSet);
        setInvestedStartups(investedSet);
      } catch (error) {
        console.error("Error fetching investor responses:", error);
      }
    };
  
    fetchInvestorResponses();
  }, [email]);
 

  
  const fetchName = async (email) => {
  try {
    const response = await fetch('/api/inv_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    console.error('Error fetching name:', err.message);
    return null;
  }
};



const fetchClientData = async (email) => {
      try {
      

        const res = await fetch(`/api/client_profile?email=${email}`);
        if (!res.ok) {
          console.error('Failed to fetch client data');
          return;
        }

        const data = await res.json();
        return data.client;

      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };


const { data: session } = useSession();


const [activeStartupId, setActiveStartupId] = useState(null);
const [selectedDateTime, setSelectedDateTime] = useState({});
 

const [loadingMeetings, setLoadingMeetings] = useState({});


const scheduleMeeting = async (startupId, startupName,client_name, client_mail, fullName, linkedIn) => {
  const startTime = selectedDateTime[startupId];
  if (!startTime) {
    alert("Please select a date and time first.");
    return;
  }

  if (!session) {
    alert("Please log in to schedule a meeting!");
    return;
  }

  const accessToken = session?.accessToken;
  if (!accessToken) {
    alert("No access token found. Please log in again.");
    signOut();
    return;
  }

  // Start animation
  setLoadingMeetings((prev) => ({ ...prev, [startupId]: true }));

  // Wait at least 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const res = await fetch("/api/schedule-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken,
        startDateTime: startTime,
        startupName,
        client_name,
        client_mail,
        investor_name: fullName,
        linkedIn,
        investor_email: email,
      }),
    });

    const data = await res.json();

    if (data.meetingLink) {
      setMeetingLinks((prev) => ({
        ...prev,
        [startupId]: data.meetingLink,
      }));
      alert("Meeting Scheduled Successfully!!");
      setActiveStartupId(null);
    } else {
      alert("Failed to schedule meeting.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred while scheduling the meeting.");
  } finally {
    setLoadingMeetings((prev) => ({ ...prev, [startupId]: false }));
  }
};
const handleLike = async (startup) => {
  const investorEmail = sessionStorage.getItem('email');
  const liked = !likedStartups.has(startup._id); 

  try {
    await fetch('/api/investorResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: investorEmail,
        startupId: startup._id,
        startupName: startup.startupName,
        liked,
      }),
    });

    setLikedStartups((prev) => {
      const newSet = new Set(prev);
      liked ? newSet.add(startup._id) : newSet.delete(startup._id);
      return newSet;
    });
  } catch (error) {
    console.error("Error updating like:", error);
  }
};

const handleInvested = async (startup) => {
  const investorEmail = sessionStorage.getItem('email');
  const invested = !investedStartups.has(startup.startupName); // toggle
  const alreadyInvested = investedStartups.has(startup._id);
  if (!alreadyInvested) {
    const confirmed = window.confirm(
      "⚠️ Choose this only if you have actually invested.\n\n" +
      "This will affect your future recommendations and you won't be recommended this startup again.\n\n" +
      "This action is **undoable**, are you sure you want to proceed?"
    );
    if (!confirmed) return;
  }
  try {
    await fetch('/api/investorResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: investorEmail,
        startupId: startup._id,
        startupName: startup.startupName,
        invested,
      }),
    });

    setInvestedStartups((prev) => {
      const newSet = new Set(prev);
      invested ? newSet.add(startup._id) : newSet.delete(startup._id);
      return newSet;
    });
  } catch (error) {
    console.error("Error updating invested:", error);
  }
};
const allRecommendedStartups = [...recommendedStartups, ...cfRecommendedStartups];

// Remove duplicates by _id
const uniqueStartups = Array.from(
  new Map(allRecommendedStartups.map(startup => [startup._id, startup])).values()
);
const [loading, setLoading] = useState(false);
const [proposals, setProposals] = useState([]);

const [fileUrl, setFileUrl] = useState(null);
const [isPopupOpen, setIsPopupOpen] = useState(false);

 
  const handleView = async (id) => {
   
  setLoading(true);

  try {
    const response = await fetch(`/api/propose/${id}`);
    if (response.status === 404) {
      alert("No File Found");
      setLoading(false);
      return;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch the file');
    }
    

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Set the file URL and open the popup
    setFileUrl(url);
    setIsPopupOpen(true);

    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
const PopupModal = ({ fileUrl, onClose }) => (
  <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
    <div className="rounded-lg border border-gray-300" style={{ width: '1000px', height: '842px' }}>
      <button 
        onClick={onClose} 
        className="absolute top-2  rounded-lg right-2 text-white"
      >
        close
      </button>
      <iframe 
        src={fileUrl} 
        className="w-full h-full" 
        title="File Preview"
      />
    </div>
  </div>
);
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md hidden md:block">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          <DashboardPage />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Recommended Startups</h1>
          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login with Google
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Welcome, {session.user.name}!</p>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
 

        {/* Startups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {uniqueStartups.map((startup) => (
            <div
              key={startup._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3 text-sm"
            >
              {/* Logo + Name */}
              <div className="flex items-center gap-3">
                
                <div>
                  <h3 className="font-semibold text-gray-800">{startup.startupName}</h3>
                  <p className="text-gray-500 text-xs">{startup.industry}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Stage: {startup.stage}</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Funding: {startup.funding}</span>
              </div>

              {/* Website */}
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs"
              >
                🌐 Visit Site
              </a>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-2">
                          <button
                    onClick={() => handleView(startup._id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
                  >
                    View
                  </button>
                  <button
                  onClick={() => handleInvested(startup)}
                  className={`px-3 py-1 border rounded-lg text-sm transition ${
                    investedStartups.has(startup._id)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'text-green-600 border-green-600'
                  }`}
                >
                  {investedStartups.has(startup._id) ? 'Invested' : 'Mark as Invested'}
                </button>

                  <button
                    onClick={() => handleLike(startup)}
                    className="text-red-500"
                  >
                    {likedStartups.has(startup._id) ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* Schedule Meeting */}
                  {activeStartupId === startup._id ? (
                    <>
                      <label className="block text-sm text-gray-600 mt-4">Choose Date & Time:</label>
                      <input
                        type="datetime-local"
                        className="mt-1 w-full p-2 border rounded"
                        onChange={(e) =>
                          setSelectedDateTime((prev) => ({
                            ...prev,
                            [startup._id]: e.target.value,
                          }))
                        }
                      />
                     
                    

                       <button
                        onClick={async () => {
                          const data = await fetchName(email);
                          const client_data= await fetchClientData(startup.client_mail);
                          console.log("client name",client_data.fullName)
                          console.log('Full Name:', data.fullName);
                          console.log('linkedin:', data.linkedIn);
                          console.log('photo:', data.photo);
                          scheduleMeeting(startup._id, startup.startupName,client_data.fullName, startup.client_mail, data.fullName,data.linkedIn);
                        }}
                        disabled={loadingMeetings[startup._id]}
                        className={`mt-2 w-full px-4 py-2 rounded-lg transition ${
                          loadingMeetings[startup._id]
                            ? "bg-gray-400 text-white cursor-wait"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {loadingMeetings[startup._id] ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>
                            Scheduling...
                          </span>
                        ) : (
                          "Confirm Meeting"
                        )}
                      </button>

                      <button
                        onClick={() => setActiveStartupId(null)}
                        className="mt-2 w-full px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                   
                    <button
                      onClick={() => setActiveStartupId(startup._id)}
                      disabled={!session}
                      className={`mt-4 w-full px-4 py-2 rounded-lg transition ${
                        session
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Schedule Meeting
                    </button>
                  )} 
                    </div>
                  ))}
                </div>



                      {isPopupOpen && (
                          <PopupModal 
                            fileUrl={fileUrl} 
                            onClose={() => setIsPopupOpen(false)} 
                          />
                        )}
                        </main>
                    </div>
                  );
                };

export default Dashboard;