import { Bid } from '@/types/bid';
import Image from 'next/image';

interface BidListProps {
  bids: Bid[];
  onAcceptBid: (bidId: string) => void;
  isAdmin: boolean;
}

export default function BidList({ bids, onAcceptBid, isAdmin }: BidListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Current Bids</h2>
      <div className="space-y-4">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className={`p-4 border rounded-lg ${
              bid.isAccepted ? 'bg-green-50 border-green-500' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src={bid.profilePicture}
                  alt={bid.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{bid.username}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm">{bid.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${bid.amount}</p>
                <p className="text-sm text-gray-500">
                  {new Date(bid.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {isAdmin && !bid.isAccepted && (
                <button
                  onClick={() => onAcceptBid(bid.id)}
                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accept Bid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 