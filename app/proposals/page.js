"use client"
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarPage from "../investor_sidebar/page";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingLinks, setMeetingLinks] = useState({});
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [likedStartups, setLikedStartups] = useState(new Set());
  const [investedStartups, setInvestedStartups] = useState(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState([]);
const [selectedStages, setSelectedStages] = useState([]);
const [selectedFunding, setSelectedFunding] = useState([]);
const [showLiked, setShowLiked] = useState(false);
const [showInvested, setShowInvested] = useState(false);


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
  }, []);

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
    return data.fullName;
  } catch (err) {
    console.error('Error fetching name:', err.message);
    return null;
  }
};

const { data: session } = useSession();


const [activeStartupId, setActiveStartupId] = useState(null);
const [selectedDateTime, setSelectedDateTime] = useState({});
 

const [loadingMeetings, setLoadingMeetings] = useState({});


const scheduleMeeting = async (startupId, startupName, client_mail, fullName) => {
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
        client_mail,
        investor_name: fullName,
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
  if (loading) return <p>Loading...</p>;

  return (
   <div className="min-h-screen flex bg-gray-100">
         {/* Sidebar */}
         <aside className="w-64 bg-white border-r shadow-md hidden md:block">
           <div className="sticky top-0 h-screen overflow-y-auto p-4">
             <SidebarPage />
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
           {/* Filter Panel */}
<div className="mb-6 p-3 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-700">🎯 Filter Startups</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Industry Filter */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">🏭 Industry</label>
      <div className="flex flex-wrap gap-2">
        {[
          "Technology", "Healthcare", "Finance", "Education", "Retail and E-commerce", 
          "Environment and Energy", "Real Estate and Construction", "Media and Entertainment", 
          "Transportation and Logistics", "Aerospace and Defense", "Food and Agriculture", 
          "Travel and Hospitality", "Legal and Compliance", "Consumer Services"
        ].map((industry) => (
          <button
            key={industry}
            onClick={() =>
              setSelectedIndustries((prev) =>
                prev.includes(industry)
                  ? prev.filter((i) => i !== industry)
                  : [...prev, industry]
              )
            }
            className={`px-3 py-1 text-sm rounded-full border transition-all ${
              selectedIndustries.includes(industry)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-blue-50"
            }`}
          >
            {industry}
          </button>
        ))}
      </div>
    </div>

    {/* Stage Filter */}
    <div >
      <label className="block mb-2 text-sm font-medium text-gray-700">📈 Startup Stage</label>
      <div className="flex flex-wrap gap-2">
        {["Early-Stage", "Growth-Stage", "Late Stage"].map((stage) => (
          <button
            key={stage}
            onClick={() =>
              setSelectedStages((prev) =>
                prev.includes(stage)
                  ? prev.filter((s) => s !== stage)
                  : [...prev, stage]
              )
            }
            className={`px-3 py-1 text-sm rounded-full border transition-all ${
              selectedStages.includes(stage)
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-100 text-gray-600 hover:bg-green-50"
            }`}
          >
            {stage}
          </button>
        ))}
      </div>
    </div>

    {/* Funding Filter */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">💸 Funding</label>
      <div className="flex flex-wrap gap-2">
        {["None (Self-funded)", "<$50k", "$50k-$500k", "$500k-$5M", "$5M+"].map((fund) => (
          <button
            key={fund}
            onClick={() =>
              setSelectedFunding((prev) =>
                prev.includes(fund)
                  ? prev.filter((f) => f !== fund)
                  : [...prev, fund]
              )
            }
            className={`px-3 py-1 text-sm rounded-full border transition-all ${
              selectedFunding.includes(fund)
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-gray-100 text-gray-600 hover:bg-purple-50"
            }`}
          >
            {fund}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Toggle Buttons */}
  <div className="flex gap-4 mt-2">
    <button
      onClick={() => setShowLiked((prev) => !prev)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all border ${
        showLiked
          ? "bg-pink-600 text-white border-pink-600"
          : "bg-gray-100 text-gray-700 hover:bg-pink-50"
      }`}
    >
      ❤️ {showLiked ? "Liked Only" : "Include Unliked"}
    </button>

    <button
      onClick={() => setShowInvested((prev) => !prev)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all border ${
        showInvested
          ? "bg-yellow-500 text-white border-yellow-500"
          : "bg-gray-100 text-gray-700 hover:bg-yellow-50"
      }`}
    >
      💼 {showInvested ? "Invested Only" : "Include Non-Invested"}
    </button>
  </div>
</div>


    
   
           {/* Startups Grid */}
           {proposals.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {proposals.filter(startup => {
    const matchesIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(startup.industry);

    const matchesStage =
      selectedStages.length === 0 || selectedStages.includes(startup.stage);
const normalizedFunding = selectedFunding.map(f => f.toLowerCase());

   const matchesFunding =
  normalizedFunding.length === 0 ||
  normalizedFunding.includes(startup.funding?.toLowerCase());

    const matchesLiked =
      !showLiked || likedStartups.has(startup._id);

    const matchesInvested =
      !showInvested || investedStartups.has(startup._id);

    return matchesIndustry && matchesStage && matchesFunding && matchesLiked && matchesInvested;
  }).map((startup) => (
                 <div
                   key={startup._id}
                   className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition-all"
                 >
                   <h2 className="text-xl font-semibold text-blue-700">{startup.startupName}</h2>
                   <p className="mt-2 text-gray-600">📌 Industry: <span className="font-medium">{startup.industry}</span></p>
                   <p className="text-gray-600">🚀 Stage: <span className="font-medium">{startup.stage}</span></p>
                   <p className="text-gray-600">💰 Funding: <span className="font-medium">{startup.funding}</span></p>
   
                   
                  {/* Show Schedule Button OR DateTime Input */}
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
                             const fullName = await fetchName(email);
                             console.log('Full Name:', fullName);
                             scheduleMeeting(startup._id, startup.startupName, startup.client_mail, fullName);
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
   
                 
   
                   <a
                     href={startup.website}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                   >
                     Visit Website
                   </a>
                   <div className="mt-4 flex gap-4 items-center">
                     {/* Like Button */}
                     <button onClick={() => handleLike(startup)}>
                     {likedStartups.has(startup._id) ? (
                       <HeartSolid className="w-6 h-6 text-red-500 cursor-pointer" />
                     ) : (
                       <HeartOutline className="w-6 h-6 text-gray-400 cursor-pointer" />
                     )}
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
   
                   </div>
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <p className="text-gray-500">No recommendations yet!</p>
                           )}
                           <button
  onClick={() => {
    setSelectedIndustries([]);
    setSelectedStages([]);
    setSelectedFunding([]);
    setShowLiked(false);
    setShowInvested(false);
  }}
  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
>
  Clear Filters
</button>

         </main>
                       </div>
  );
};

export default Proposals;
