export interface Job {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  poster_id: string;
  bids?: {
    id: string;
    amount: number;
    bidder_id: string;
    created_at: string;
  }[];
} 