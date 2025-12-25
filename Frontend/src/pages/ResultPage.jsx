import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  AlertTriangle,
  Zap,
  Shield,
  Lightbulb,
  Search,
  MessageSquare
} from 'lucide-react';
import { reviewAPI } from '../services/api';
import { Editor } from '@monaco-editor/react';

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    loadReview();
  }, [id]);

  const loadReview = async () => {
    try {
      const data = await reviewAPI.getReviewById(id);
      setReview(data);
      if (data.issues && data.issues.length > 0) {
        setSelectedIssue(data.issues[0]);
      }
    } catch (error) {
      console.error('Failed to load review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (review) {
      navigator.clipboard.writeText(review.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-neutral-500">Loading review data...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-neutral-500">Review not found</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-primary hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'security': return Shield;
      case 'performance': return Zap;
      case 'style': return Search;
      default: return Lightbulb;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Code Review</h1>
              <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-mono border border-neutral-700 text-neutral-400 uppercase tracking-wider">
                {review.language}
              </span>
            </div>
            <p className="text-neutral-500 text-sm">{new Date(review.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2.5 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-neutral-400 transition-all flex items-center gap-2">
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs font-semibold">Copy Code</span>
          </button>
          <button className="p-2.5 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-neutral-400 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
        {/* Left: Code Editor */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="bg-neutral-800/50 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Source Code</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-bold text-neutral-500 flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                READ ONLY
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              theme="vs-dark"
              language={review.language}
              value={review.code}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                lineNumbers: 'on',
                glyphMargin: true
              }}
            />
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-hidden">
          {/* Quality Score Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-20 transition-all duration-500
              ${review.score > 80 ? 'bg-emerald-500' : review.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Health Score</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">{review.score || 0}</span>
                  <span className="text-neutral-500 font-bold">/100</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border 
                  ${review.score > 80 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
                    review.score > 50 ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 
                    'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                  {review.score > 80 ? 'Excellent' : review.score > 50 ? 'Needs Improvement' : 'Critical'}
                </div>
                <p className="text-[10px] text-neutral-500 mt-2 font-medium">Based on 4 vectors</p>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-xl">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Discovered Issues ({(review.issues || []).length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {(review.issues || []).length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <Check className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                  <p>No issues found! Great job!</p>
                </div>
              ) : (
                (review.issues || []).map((issue, index) => {
                  const Icon = Lightbulb;
                  return (
                    <motion.div 
                      key={index}
                      onClick={() => setSelectedIssue(issue)}
                      className={`
                        p-4 rounded-2xl border transition-all cursor-pointer group
                        ${selectedIssue === issue 
                          ? 'bg-neutral-800 border-neutral-700 shadow-lg' 
                          : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'}
                      `}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${getSeverityColor(issue.severity)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Line {issue.line || 'N/A'}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-neutral-200 mb-4 line-clamp-2">{issue.message}</p>
                      
                      {selectedIssue === issue && (review.suggestions || []).length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-4 border-t border-neutral-800"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-3 h-3 text-primary" />
                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Suggestions</h4>
                          </div>
                          <ul className="space-y-2">
                            {(review.suggestions || []).slice(0, 3).map((suggestion, i) => (
                              <li key={i} className="p-3 rounded-xl bg-neutral-900 font-mono text-xs text-neutral-300 border border-neutral-800">
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultPage;

