import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { 
  Play, 
  Trash2, 
  Settings, 
  Terminal, 
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { reviewAPI } from '../services/api';

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' }
];

const NewReviewPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('// Paste your code here...\n\nfunction example() {\n  console.log("Hello, World!");\n}');
  const [language, setLanguage] = useState(LANGUAGES[0].value);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!code.trim() || code.length < 10) {
      setError("Please provide a more substantial code snippet.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const review = await reviewAPI.createReview(code, language);
      navigate(`/review/${review._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Code Review</h1>
          <p className="text-neutral-400 mt-1">Submit your code for AI analysis and optimization feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCode('')}
            className="p-3 rounded-xl border border-neutral-800 hover:bg-neutral-900 transition-colors text-neutral-400"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            disabled={isAnalyzing}
            onClick={handleAnalyze}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg 
              ${isAnalyzing ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 active:scale-[0.98]'}
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="bg-neutral-800/50 px-6 py-3 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/30"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
              </div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest border-l border-neutral-700 pl-4">Editor</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Terminal className="w-3 h-3" />
              <span>Line 1, Column 1</span>
            </div>
          </div>
          <div className="flex-1 min-h-0 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                lineNumbers: 'on',
                roundedSelection: true,
                cursorSmoothCaretAnimation: "on"
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2 block">Language</label>
                <div className="relative">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-neutral-800 border-none rounded-xl py-3 px-4 text-sm appearance-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BrainCircuit className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold">AI Guidelines</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Security Vulnerabilities",
                "Performance Bottlenecks",
                "Readability & Style",
                "Modern Best Practices"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-neutral-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReviewPage;

