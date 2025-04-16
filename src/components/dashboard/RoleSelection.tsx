'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RoleSelection() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'bidder' | 'poster'>('bidder');

  const handleRoleSelection = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', user.id);

      if (updateError) throw updateError;

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Choose Your Role</h2>
      <p className="text-gray-600 mb-6">
        Please select whether you want to post jobs or bid on jobs.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="bidder"
            name="role"
            value="bidder"
            checked={selectedRole === 'bidder'}
            onChange={() => setSelectedRole('bidder')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="bidder" className="text-gray-700">
            I want to bid on jobs
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="poster"
            name="role"
            value="poster"
            checked={selectedRole === 'poster'}
            onChange={() => setSelectedRole('poster')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="poster" className="text-gray-700">
            I want to post jobs
          </label>
        </div>
      </div>

      <button
        onClick={handleRoleSelection}
        disabled={loading}
        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
} 