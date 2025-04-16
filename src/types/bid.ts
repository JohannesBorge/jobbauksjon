export interface Bid {
  id: string;
  userId: string;
  username: string;
  profilePicture: string;
  rating: number;
  amount: number;
  timestamp: Date;
  isAccepted?: boolean;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  bids: Bid[];
} 