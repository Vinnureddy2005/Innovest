"use client";


import { useState, useEffect } from 'react';
import DashboardPage from "../investor_sidebar/page";

const Dashboard = () => {
  const [recommendedStartups, setRecommendedStartups] = useState([]);
  const investorId = 'your-investor-id'; // or get from session/cookie/etc.

  useEffect(() => {
    // Fetch the recommended startups from the API
    const fetchRecommendedStartups = async () => {
      const response = await fetch(`/api/investor/recommendations?investorId=${investorId}`);
      const data = await response.json();
      setRecommendedStartups(data);
    };

    fetchRecommendedStartups();
  }, [investorId]);

  return (
    
    <div className="dashboard">
            <DashboardPage/>

      <h1>Recommended Startups</h1>
      <div className="startup-cards">
        {recommendedStartups.length > 0 ? (
          recommendedStartups.map(startup => (
            <div className="card" key={startup._id}>
              <h2>{startup.startupName}</h2>
              <p>Industry: {startup.industry}</p>
              <p>Stage: {startup.stage}</p>
              <p>Funding: {startup.funding}</p>
              <a href={startup.website} target="_blank">Visit Website</a>
            </div>
          ))
        ) : (
          <p>No recommendations yet!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
