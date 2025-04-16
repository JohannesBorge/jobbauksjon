import { Job } from '@/types/bid';

interface JobListProps {
  jobs: Job[];
  onSelectJob: (jobId: string) => void;
  selectedJobId: string | null;
}

export default function JobList({ jobs, onSelectJob, selectedJobId }: JobListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedJobId === job.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => onSelectJob(job.id)}
          >
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-600 mt-2">{job.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              {job.bids.length} {job.bids.length === 1 ? 'bid' : 'bids'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 