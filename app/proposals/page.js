"use client"
import { useEffect, useState } from 'react';

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      const response = await fetch('/api/proposals');
      const data = await response.json();
      setProposals(data);
      setLoading(false);
    };

    fetchProposals();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>All Proposals</h1>
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal._id}>
            <h2>{proposal.startupName}</h2>
            <p>Industry: {proposal.industry}</p>
            <p>Stage: {proposal.stage}</p>
            <p>Funding: {proposal.funding}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Proposals;
