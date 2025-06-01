


"use client"
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FeedbackPopup from '../investor_feedback/page';
import SidebarPage from "../investor_sidebar/page";

const Proposals = () => {
  const router = useRouter(); 
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [likedStartups, setLikedStartups] = useState(new Set());
  const [investedStartups, setInvestedStartups] = useState(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState([]);
const [selectedStages, setSelectedStages] = useState([]);
const [selectedFunding, setSelectedFunding] = useState([]);
const [showLiked, setShowLiked] = useState(false);
const [showInvested, setShowInvested] = useState(false);
const [fileUrl, setFileUrl] = useState(null);
const [isPopupOpen, setIsPopupOpen] = useState(false);
const [feedbackStartupName, setFeedbackStartupName] = useState(null);
const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
 const openFeedback = () => setIsFeedbackOpen(true);
const closeFeedback = () => setIsFeedbackOpen(false);

const [feedbackMail,setfeedbackMail] =useState("");
const [Invphoto,setInvphoto] =useState("");
const [startupId,setStartupId] =useState("");
const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
const [fundingDropdownOpen, setFundingDropdownOpen] = useState(false);
const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Retail and E-commerce",
  "Environment and Energy", "Real Estate and Construction", "Media and Entertainment",
  "Transportation and Logistics", "Aerospace and Defense", "Food and Agriculture",
  "Travel and Hospitality", "Legal and Compliance", "Consumer Services"
];
 const stages = [
    "Idea", "Prototype", "Minimum Viable Product (MVP)", "Scaling",
    "Revenue-Generating", "Growth", "Exit"
  ];

  const fundings = [
    "None", "Pre-Seed", "Seed", "Series A", "Series B",
    "Series C", "Series D+", "IPO/Acquired"
  ];

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

  useEffect(() => {
    if (!email) return;
    sessionStorage.setItem('email', email);
    console.log(email)
    const fetchProposals = async () => {
    const response = await fetch(`/api/proposals?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setProposals(data);
      setLoading(false);
    };

    fetchProposals();
  }, [email]);

 useEffect(() => {
    if (!email) return;
        sessionStorage.setItem('email', email);

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

const { data: session } = useSession();


const [activeStartupId, setActiveStartupId] = useState(null);
const [selectedDateTime, setSelectedDateTime] = useState({});
 

const [loadingMeetings, setLoadingMeetings] = useState({});

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
  if (loading) return <p>Loading...</p>;
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
  const handleLogout = () => {
    sessionStorage.removeItem('email');
    localStorage.removeItem('authToken'); 
    router.push('/'); 
  };


console.log(scheduledStartups)
  return (
   <div className="min-h-screen flex bg-gray-100">
         {/* Sidebar */}
         <aside className="w-64 bg-white border-r shadow-md hidden md:block">
           <div className="sticky top-0 h-screen overflow-y-auto p-4">
             <SidebarPage handleLogout={handleLogout}/>
           </div>
         </aside>
   
         {/* Main Content */}
         <main className="flex-1 p-6 overflow-y-auto">
           {/* Header */}
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-3xl font-bold text-gray-800">All Startups</h1>
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
           {/* Filter Panel */}
<div className="mb-6 p-4 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-700">🎯 Filter Startups</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Industry Filter */}
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
        className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-full shadow-sm hover:bg-gray-200 min-w-[10rem]"
      >
        🏭 Industry
        <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {industryDropdownOpen && (
        <div className="absolute z-10 mt-2 w-64 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-800">Filter by Industry</h4>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {industries.map((industry) => (
              <label key={industry} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedIndustries.includes(industry)}
                  onChange={() =>
                    setSelectedIndustries((prev) =>
                      prev.includes(industry)
                        ? prev.filter((i) => i !== industry)
                        : [...prev, industry]
                    )
                  }
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                {industry}
              </label>
            ))}
          </div>
          <button
            onClick={() => setIndustryDropdownOpen(false)}
            className="mt-4 min-w-full bg-blue-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>

    {/* Stage Filter */}
    <div className="relative inline-block text-left">
      <button
        onClick={() => setStageDropdownOpen(!stageDropdownOpen)}
        className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-full shadow-sm hover:bg-gray-200 min-w-[10rem] "
      >
        📈 Startup Stage
        <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {stageDropdownOpen && (
        <div className="absolute z-10 mt-2 w-64 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-800">Filter by Startup Stage</h4>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {["Early-Stage", "Growth-Stage", "Late Stage"].map((stage) => (
              <label key={stage} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedStages.includes(stage)}
                  onChange={() =>
                    setSelectedStages((prev) =>
                      prev.includes(stage)
                        ? prev.filter((s) => s !== stage)
                        : [...prev, stage]
                    )
                  }
                  className="form-checkbox h-4 w-4 text-green-600"
                />
                {stage}
              </label>
            ))}
          </div>
          <button
            onClick={() => setStageDropdownOpen(false)}
            className="mt-4 min-w-full  bg-green-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>

    {/* Funding Filter */}
    <div className="relative inline-block text-left">
      <button
        onClick={() => setFundingDropdownOpen(!fundingDropdownOpen)}
        className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-full shadow-sm hover:bg-gray-200 min-w-[10rem] "
      >
        💸 Funding
        <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {fundingDropdownOpen && (
        <div className="absolute z-10 mt-2 w-64 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-800">Filter by Funding</h4>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {["None (Self-funded)", "<$50k", "$50k-$500k", "$500k-$5M", "$5M+"].map((fund) => (
              <label key={fund} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedFunding.includes(fund)}
                  onChange={() =>
                    setSelectedFunding((prev) =>
                      prev.includes(fund)
                        ? prev.filter((f) => f !== fund)
                        : [...prev, fund]
                    )
                  }
                  className="form-checkbox h-4 w-4 text-purple-600"
                />
                {fund}
              </label>
            ))}
          </div>
          <button
            onClick={() => setFundingDropdownOpen(false)}
            className="mt-4 min-w-full  bg-purple-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>

    {/* Toggle - Liked */}
    <div>
      <button
        onClick={() => setShowLiked((prev) => !prev)}
        className={`min-w-[10rem]  ml-auto flex items-center justify-center gap-10 px-4 py-2 rounded-full text-sm transition-all border ${
          showLiked
            ? "bg-pink-600 text-white border-pink-600"
            : "bg-gray-100 text-gray-700 hover:bg-pink-50"
        }`}
      >
        ❤️ {showLiked ? "Liked Only" : "Include Unliked"}
      </button>
    </div>

    {/* Toggle - Invested */}
    <div>
      <button
        onClick={() => setShowInvested((prev) => !prev)}
        className={`min-w-[10rem]  ml-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm transition-all border ${
          showInvested
            ? "bg-yellow-500 text-white border-yellow-500"
            : "bg-gray-100 text-gray-700 hover:bg-yellow-50"
        }`}
      >
        💼 {showInvested ? "Invested Only" : "Include Non-Invested"}
      </button>
    </div>
  </div>
</div>

    
   
           {/* Startups Grid */}
           {proposals.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {proposals
      .filter((startup) => {
        const matchesIndustry =
          selectedIndustries.length === 0 || selectedIndustries.includes(startup.industry);
        const matchesStage =
          selectedStages.length === 0 || selectedStages.includes(startup.stage);
        const normalizedFunding = selectedFunding.map((f) => f.toLowerCase());
        const matchesFunding =
          normalizedFunding.length === 0 ||
          normalizedFunding.includes(startup.funding?.toLowerCase());
        const matchesLiked = !showLiked || likedStartups.has(startup._id);
        const matchesInvested = !showInvested || investedStartups.has(startup._id);

        return matchesIndustry && matchesStage && matchesFunding && matchesLiked && matchesInvested;
      })
      .map((startup) => (
        <div
          key={startup._id}
          className="bg-white rounded-xl shadow-md p-4 w-full max-w-sm flex flex-col justify-between space-y-3"
        >
          {/* Logo + Name */}
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
          console.log("linkedin",data.linkedIn)
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
                  'Confirm Meeting'
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
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Schedule Meeting
            </button>
          )}
        </div>
      ))}
  </div>
) : (
  <p className="text-gray-500 text-center mt-10">No proposals found.</p>
)}

     
{isPopupOpen && (
                          <PopupModal 
                            fileUrl={fileUrl} 
                            onClose={() => setIsPopupOpen(false)} 
                          />
                        )}
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

export default Proposals;
