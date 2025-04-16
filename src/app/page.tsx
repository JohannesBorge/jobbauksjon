'use client';

import { useState, useEffect } from 'react';
import BidList from '@/components/BidList';
import BidForm from '@/components/BidForm';
import { Bid, Job } from '@/types/bid';
import { mockUsers, generateRandomBid, initialJob } from '@/data/mockData';

export default function Home() {
  const [job, setJob] = useState<Job>(initialJob);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate real-time bidding
    const interval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const newBid = generateRandomBid(randomUser);
      setJob((prevJob) => ({
        ...prevJob,
        bids: [...prevJob.bids, newBid].sort((a, b) => a.amount - b.amount),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePlaceBid = (amount: number) => {
    const currentUser = mockUsers[0]; // Simulate current user
    const newBid = {
      ...generateRandomBid(currentUser),
      amount,
    };
    setJob((prevJob) => ({
      ...prevJob,
      bids: [...prevJob.bids, newBid].sort((a, b) => a.amount - b.amount),
    }));
  };

  const handleAcceptBid = (bidId: string) => {
    setJob((prevJob) => ({
      ...prevJob,
      bids: prevJob.bids.map((bid) =>
        bid.id === bidId ? { ...bid, isAccepted: true } : bid
      ),
    }));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {isAdmin ? 'Switch to Bidder View' : 'Switch to Admin View'}
          </button>
        </div>
        <p className="text-gray-600 mb-8">{job.description}</p>
        
        <BidList
          bids={job.bids}
          onAcceptBid={handleAcceptBid}
          isAdmin={isAdmin}
        />
        
        {!isAdmin && <BidForm onSubmit={handlePlaceBid} />}
      </div>
    </main>
  );
}
