// "use client";


// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import DashboardPage from "../investor_sidebar/page";

// const Dashboard = () => {
//   const [recommendedStartups, setRecommendedStartups] = useState([]);


 
//   const searchParams = useSearchParams();
//   const email = searchParams.get('email');
//   console.log(email)

 


//   useEffect(() => {
//     if (!email) return;
//     if (email) {
//       sessionStorage.setItem('email', email);
//     }

//     const fetchRecommendedStartups = async () => {
//       try {
//         const response = await fetch(`/api/recommendations?email=${email}`);
//         const data = await response.json();
//         setRecommendedStartups(data);
//       } catch (error) {
//         console.error("Error fetching recommendations:", error);
//       }
//     };

//     fetchRecommendedStartups();
//   }, [email]);
  

//   return (
    
//     <div className="dashboard">
//             <DashboardPage/>

//       <h1>Recommended Startups</h1>
//       <div className="startup-cards">
//         {recommendedStartups.length > 0 ? (
//           recommendedStartups.map(startup => (
//             <div className="card" key={startup._id}>
//               <h2>{startup.startupName}</h2>
//               <p>Industry: {startup.industry}</p>
//               <p>Stage: {startup.stage}</p>
//               <p>Funding: {startup.funding}</p>
//               <a href={startup.website} target="_blank">Visit Website</a>
//             </div>
//           ))
//         ) : (
//           <p>No recommendations yet!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardPage from "../investor_sidebar/page";

const Dashboard = () => {
  const [recommendedStartups, setRecommendedStartups] = useState([]);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Recommended Startups</h1>

        {recommendedStartups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedStartups.map((startup) => (
              <div
                key={startup._id}
                className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition-all"
              >
                <h2 className="text-xl font-semibold text-blue-700">{startup.startupName}</h2>
                <p className="mt-2 text-gray-600">📌 Industry: <span className="font-medium">{startup.industry}</span></p>
                <p className="text-gray-600">🚀 Stage: <span className="font-medium">{startup.stage}</span></p>
                <p className="text-gray-600">💰 Funding: <span className="font-medium">{startup.funding}</span></p>
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Visit Website
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recommendations yet!</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
