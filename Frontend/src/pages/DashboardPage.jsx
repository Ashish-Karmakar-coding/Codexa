import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  FileCode, 
  ShieldAlert, 
  Activity,
  Plus,
  Filter,
  MoreVertical,
  Search
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { reviewAPI } from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewAPI.getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = reviews.length > 0 
    ? Math.round(reviews.reduce((acc, r) => acc + (r.score || 0), 0) / reviews.length) 
    : 0;

  const highSeverityIssues = reviews.reduce((acc, r) => {
    return acc + (r.issues?.filter(i => i.severity === 'high').length || 0);
  }, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-neutral-400 mt-1">Welcome back! Here is what's happening with your code.</p>
        </div>
        <button 
          onClick={() => navigate('/review/new')}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>New Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reviews" value={reviews.length} icon={FileCode} trend="+12%" trendUp={true} />
        <StatCard title="Average Score" value={`${avgScore}%`} icon={Activity} trend="+4%" trendUp={true} />
        <StatCard title="Security Issues" value={highSeverityIssues} icon={ShieldAlert} trend="-2" trendUp={true} />
        <StatCard title="Success Rate" value="98.2%" icon={BarChart3} trend="+1.5%" trendUp={true} />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 text-sm text-neutral-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Find a review..." 
                className="bg-neutral-800 border-none rounded-lg py-1.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary/50 w-48"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {reviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileCode className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-300">No reviews yet</h3>
              <p className="text-neutral-500 mt-2 mb-6">Analyze your first piece of code to see it here.</p>
              <button 
                onClick={() => navigate('/review/new')}
                className="text-primary hover:underline font-medium"
              >
                Start a review →
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-800/30 text-neutral-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Language</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Issues</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {reviews.map((review) => (
                  <motion.tr 
                    key={review._id} 
                    variants={item}
                    className="hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/review/${review._id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-neutral-800 text-xs font-mono border border-neutral-700">
                        {review.language}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${review.score > 80 ? 'bg-emerald-500' : review.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        <span className="font-bold">{review.score || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-1">
                        {(review.issues || []).slice(0, 3).map((issue, idx) => (
                          <div 
                            key={idx}
                            className={`w-6 h-6 rounded-full border-2 border-neutral-900 flex items-center justify-center text-[10px] font-bold
                              ${issue.severity === 'high' ? 'bg-red-500/20 text-red-500' : issue.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}
                          >
                            !
                          </div>
                        ))}
                        {(review.issues || []).length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] font-medium text-neutral-400">
                            +{(review.issues || []).length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        className="p-1 hover:bg-neutral-700 rounded-md transition-colors text-neutral-500"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;

