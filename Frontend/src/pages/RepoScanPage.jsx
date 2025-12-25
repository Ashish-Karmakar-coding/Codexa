import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  ArrowRight
} from 'lucide-react';
import { repoAPI } from '../services/api';

const RepoScanPage = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleScan = async () => {
    if (!owner.trim() || !repo.trim()) {
      setError('Please provide both owner and repository name');
      return;
    }

    setIsScanning(true);
    setError(null);
    setResults(null);

    try {
      const data = await repoAPI.scanRepository(owner.trim(), repo.trim());
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to scan repository');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scan GitHub Repository</h1>
        <p className="text-neutral-400 mt-1">Analyze an entire repository for code quality issues.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Github className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Repository Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2 block">
              Owner / Organization
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g., facebook"
              className="w-full bg-neutral-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/50"
              disabled={isScanning}
            />
          </div>

          <div>
            <label className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2 block">
              Repository Name
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g., react"
              className="w-full bg-neutral-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/50"
              disabled={isScanning}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`
              w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg
              ${isScanning 
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 active:scale-[0.98]'}
            `}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Scanning Repository...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Start Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Results */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {results.owner}/{results.repo}
                </h2>
                <p className="text-neutral-400 mt-1">
                  Scanned {results.totalFiles} files
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-500 mb-1">Overall Score</div>
                <div className={`text-5xl font-black ${results.overallScore > 80 ? 'text-emerald-500' : results.overallScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                  {results.overallScore}
                </div>
              </div>
            </div>
          </div>

          {/* File Results */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-neutral-800">
              <h3 className="text-xl font-bold">File Analysis</h3>
            </div>
            <div className="divide-y divide-neutral-800 max-h-[600px] overflow-y-auto custom-scrollbar">
              {results.files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileCode className="w-4 h-4 text-neutral-500" />
                        <span className="font-mono text-sm text-neutral-300">{file.path}</span>
                        <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-xs font-mono border border-neutral-700 text-neutral-400">
                          {file.language}
                        </span>
                      </div>
                      {file.error ? (
                        <p className="text-sm text-red-500">{file.error}</p>
                      ) : (
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${file.score > 80 ? 'bg-emerald-500' : file.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-bold">Score: {file.score}%</span>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {file.issues?.length || 0} issues
                          </span>
                        </div>
                      )}
                    </div>
                    {!file.error && (
                      <button
                        onClick={() => {
                          // Navigate to detailed view or show issues
                        }}
                        className="p-2 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-400 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RepoScanPage;

