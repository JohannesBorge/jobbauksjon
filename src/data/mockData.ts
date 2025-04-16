import { Bid, Job } from '@/types/bid';

export const mockUsers = [
  {
    id: '1',
    username: 'JohnDoe',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    rating: 4.8,
  },
  {
    id: '2',
    username: 'JaneSmith',
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    rating: 4.9,
  },
  {
    id: '3',
    username: 'MikeJohnson',
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    rating: 4.7,
  },
  {
    id: '4',
    username: 'SarahWilliams',
    profilePicture: 'https://i.pravatar.cc/150?img=4',
    rating: 4.6,
  },
];

export const generateRandomBid = (user: typeof mockUsers[0]): Bid => {
  const amount = Math.floor(Math.random() * 1000) + 100;
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId: user.id,
    username: user.username,
    profilePicture: user.profilePicture,
    rating: user.rating,
    amount,
    timestamp: new Date(),
  };
};

export const initialJob: Job = {
  id: '1',
  title: 'Website Development',
  description: 'Need a professional website built with modern technologies',
  bids: [],
}; 