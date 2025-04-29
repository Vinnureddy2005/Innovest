'use client';  // If you're using client-side rendering in the component

import { useEffect, useState } from 'react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with the actual investor ID from your authentication or context
    const investorId = 'your-investor-id-here'; 

    // Fetch recommendations from the API route
    fetch(`/api/recommendations?investorId=${investorId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          setRecommendations(data);
        }
      })
      .catch((err) => {
        setError('Failed to load recommendations');
        console.error(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Recommendations</h1>
      <ul>
        {recommendations.map((proposal) => (
          <li key={proposal._id}>{proposal.startupName}</li>
        ))}
      </ul>
    </div>
  );
}

