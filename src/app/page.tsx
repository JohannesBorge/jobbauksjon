'use client';

import { useState } from 'react';
import BidList from '@/components/BidList';
import BidForm from '@/components/BidForm';
import JobForm from '@/components/JobForm';
import JobList from '@/components/JobList';
import { Job } from '@/types/bid';
import { mockUsers, generateRandomBid } from '@/data/mockData';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  const handlePostJob = (title: string, description: string) => {
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      bids: [],
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
    if (!selectedJobId) {
      setSelectedJobId(newJob.id);
    }
  };

  const handlePlaceBid = (amount: number) => {
    if (!selectedJobId) return;

    const currentUser = mockUsers[0]; // Simulate current user
    const newBid = {
      ...generateRandomBid(currentUser),
      amount,
    };

    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === selectedJobId
          ? {
              ...job,
              bids: [...job.bids, newBid].sort((a, b) => a.amount - b.amount),
            }
          : job
      )
    );
  };

  const handleAcceptBid = (bidId: string) => {
    if (!selectedJobId) return;

    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === selectedJobId
          ? {
              ...job,
              bids: job.bids.map(bid =>
                bid.id === bidId ? { ...bid, isAccepted: true } : bid
              ),
            }
          : job
      )
    );
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Job Auction Platform</h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {isAdmin ? 'Switch to Bidder View' : 'Switch to Admin View'}
          </button>
        </div>

        {isAdmin && <JobForm onSubmit={handlePostJob} />}

        <JobList
          jobs={jobs}
          onSelectJob={setSelectedJobId}
          selectedJobId={selectedJobId}
        />

        {selectedJob && (
          <>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
              <p className="text-gray-600 mb-8">{selectedJob.description}</p>
              
              <BidList
                bids={selectedJob.bids}
                onAcceptBid={handleAcceptBid}
                isAdmin={isAdmin}
              />
              
              {!isAdmin && <BidForm onSubmit={handlePlaceBid} />}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
