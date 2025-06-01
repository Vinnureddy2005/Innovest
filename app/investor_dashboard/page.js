
"use client"
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FeedbackPopup from '../investor_feedback/page';
import DashboardPage from "../investor_sidebar/page";
const Dashboard = () => {
  const [recommendedStartups, setRecommendedStartups] = useState([]);
  const [cfRecommendedStartups, setCFRecommendedStartups] = useState([]);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [likedStartups, setLikedStartups] = useState(new Set());
  const [investedStartups, setInvestedStartups] = useState(new Set());
const [feedbackStartupName, setFeedbackStartupName] = useState(null);

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
        console.log('Collaborative Filtering Startups:', data);
        setCFRecommendedStartups(data.recommendations || []);
      } catch (error) {
        console.error("Error fetching collaborative filtering recommendations:", error);
      }
    };

    fetchCFRecommendedStartups();
  }, [email]);

  useEffect(() => {
    console.log("Updated cfRecommendedStartups:", cfRecommendedStartups);
  }, [cfRecommendedStartups]);

  useEffect(() => {
    if (!email) return;

    const fetchInvestorResponses = async () => {
      try {
        const res = await fetch(`/api/investorResponse?email=${email}`);
        const data = await res.json();

        const likedSet = new Set();
        const investedSet = new Set();

        data.forEach((item) => {
          if (item.liked) likedSet.add(item.startupId);
          if (item.invested) investedSet.add(item.startupId);
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
        headers: { 'Content-Type': 'application/json' },
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




  
  const { data: session } = useSession();
  const [activeStartupId, setActiveStartupId] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState({});
  const [loadingMeetings, setLoadingMeetings] = useState({});
  const [fileUrl, setFileUrl] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Used here

  const scheduleMeeting = async (startupId, startupName,client_name, client_mail,clientphoto, fullName, invphoto,linkedIn) => {
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

    setLoadingMeetings((prev) => ({ ...prev, [startupId]: true }));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch("/api/schedule-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          startDateTime: startTime,
          startupId,
          startupName,
          client_name,
          client_mail,
          clientphoto,
          linkedIn,
          investor_name: fullName,
          invphoto,
          investor_email: email,
        }),
      });

      const data = await res.json();

      if (data.meetingLink) {
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
    const invested = !investedStartups.has(startup.startupName);
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
      setFileUrl(url);
      setIsPopupOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter(); 
  const allRecommendedStartups = [...recommendedStartups, ...cfRecommendedStartups];
  const uniqueStartups = Array.from(
    new Map(
      allRecommendedStartups
       // Only startups with invested: false
        .map(startup => [startup._id, startup])
    ).values()
  );

  const PopupModal = ({ fileUrl, onClose }) => (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
      <div className="rounded-lg border border-gray-300" style={{ width: '1000px', height: '842px' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-white rounded-lg">close</button>
        <iframe src={fileUrl} className="w-full h-full" title="File Preview" />
      </div>
    </div>
  );

  const [scheduledStartups, setScheduledStartups] = useState(new Set());
  useEffect(() => {
  if (!email) return;

  const fetchScheduledMeetings = async () => {
    try {
      const res = await fetch('/api/get-investor-meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ investor_email: email }),
        });
      const data = await res.json();
      const scheduledSet = new Set(data.map(meeting => meeting.startupId));
      setScheduledStartups(scheduledSet);
    } catch (error) {
      console.error("Error fetching scheduled meetings:", error);
    }
  };

  fetchScheduledMeetings();
}, [email]);

console.log(scheduledStartups)

 const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const openFeedback = () => setIsFeedbackOpen(true);
  const closeFeedback = () => setIsFeedbackOpen(false);

  const [feedbackMail,setfeedbackMail] =useState("");
  const [Invphoto,setInvphoto] =useState("");
  const [startupId,setStartupId] =useState("");
 const handleLogout = () => {
    sessionStorage.removeItem('email');
    localStorage.removeItem('authToken'); 
    router.push('/'); 
  };
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r shadow-md hidden md:block">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          <DashboardPage email={email} handleLogout={handleLogout}/>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
    
       <div className="flex justify-between items-center mb-6">
             <h1 className="text-3xl font-bold text-gray-800">AI Recommended Startups</h1>
             {!session ? (
               <div className="flex flex-col items-start sm:items-end">
      <p className="text-m text-gray-800 mb-1">
        <strong>Note:</strong> To schedule meetings, please login with Google Mail.
      </p>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Login with Google
      </button>
      </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {uniqueStartups.map((startup) => (
    <div
  key={startup._id}
   className="bg-white rounded-xl shadow-md p-4 w-full max-w-sm flex flex-col justify-between space-y-3"
  
>
  {/* Top Row: Logo + Text */}
  <div className="flex items-center space-x-4">
   <img
    src={startup.photo || "/images/no-profile.png"}
    alt={startup.startupName}
    className="w-12 h-12 rounded-full object-cover"
  />

    <div>
      <h2 className="text-md font-semibold text-gray-800">{startup.startupName}</h2>
      <p className="text-sm text-gray-500">{startup.industry}</p>
    </div>
  </div>

  {/* Badges */}
  <div className="flex gap-2 flex-wrap text-sm">
    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
      Stage: {startup.stage}
    </span>
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
      Funding: {startup.funding}
    </span>
  </div>

  {/* Website link */}
  {startup.website && (
    <a
      href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}

      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-sm text-blue-600 hover:underline"
    >
      🌐 Visit Site
    </a>
  )}

  {/* View + Invest + Like */}
<div className="flex items-center justify-between space-x-2">
  {/* View Button */}
  <button
    onClick={() => handleView(startup._id)}
    className="px-4 py-1 bg-blue-700 text-white text-sm rounded-full hover:bg-blue-800 transition"
  >
    View
  </button>

  {/* Invest Button */}
  <button
  onClick={() => handleInvested(startup)}
  className={`px-4 py-2 border rounded-lg text-sm font-semibold transition ${
    investedStartups.has(startup._id)
      ? 'bg-green-600 text-white border-green-600'
      : 'text-green-600 border-green-600 hover:bg-green-50'
  }`}
>
  {investedStartups.has(startup._id) ? 'Invested' : 'Mark as Invested'}
</button>


  {/* Like Button */}
  <button onClick={() => handleLike(startup)}>
    {likedStartups.has(startup._id) ? (
      <HeartSolid className="w-5 h-5 text-red-500" />
    ) : (
      <HeartOutline className="w-5 h-5 text-gray-400" />
    )}
  </button>
</div>

  

  {/* Schedule Meeting */}
  {scheduledStartups.has(startup._id) ? (
   <button
  className="pop inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium bg-purple-300 text-purple-900 rounded-full shadow-sm hover:bg-purple-400 transition duration-300"
  onClick={async () => {
    console.log("button clicked");
    const data = await fetchName(email);
    console.log("data came", data.photo);
    setFeedbackStartupName(startup.startupName);
    setfeedbackMail(startup.client_mail);
    setInvphoto(data.photo);
    setStartupId(startup._id);
    openFeedback();
  }}
>
  💬 Give Feedback
</button>



  ) : activeStartupId === startup._id ? (
    <>
      <input
        type="datetime-local"
        className="w-full p-2 border rounded-md text-sm mt-2"
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
          //const client_data = await fetchClientData(startup.client_mail);
          console.log("photo",startup.photo)
          scheduleMeeting(
            startup._id,
            startup.startupName,
            startup.clientName,
            startup.client_mail,
            startup.photo||"",
            data.fullName,
            data.photo || "",
            data.linkedIn
          );
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
                              className="w-full py-2 text-sm mt-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setActiveStartupId(startup._id)}
                            disabled={!session}
                            className={`w-full py-2 rounded-md transition ${
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
                        {isFeedbackOpen && (
                              <FeedbackPopup
                              startupId={startupId}
                                startupName={feedbackStartupName}
                                clientEmail={feedbackMail}
                                Invphoto={Invphoto}
                                onClose={closeFeedback}
                              />
                            )}


                        </main>
                    </div>
                  );
                };

export default Dashboard;

