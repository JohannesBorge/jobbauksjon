import { useState } from 'react';

interface BidFormProps {
  onSubmit: (amount: number) => void;
}

export default function BidForm({ onSubmit }: BidFormProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onSubmit(numericAmount);
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Your Bid Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your bid amount"
            min="0"
            step="0.01"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Place Bid
        </button>
      </div>
    </form>
  );
} 