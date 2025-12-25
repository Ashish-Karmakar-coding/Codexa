import { motion } from 'framer-motion';
import { Github, Code2, Shield, Zap, Sparkles } from 'lucide-react';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const handleLogin = () => {
    authAPI.githubLogin();
  };

  const Feature = ({ icon: Icon, title, desc }) => (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-neutral-500 text-xs px-4">{desc}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] opacity-30"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <Code2 className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4">
          CodeSense <span className="text-primary">AI</span>
        </h1>
        <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
          The intelligence layer for your development workflow. High-performance code reviews in seconds.
        </p>

        <button
          onClick={handleLogin}
          className="group relative flex items-center justify-center gap-3 w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-neutral-200 transition-all duration-300 transform active:scale-[0.98] shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <Github className="w-5 h-5" />
          <span>Continue with GitHub</span>
        </button>

        <p className="mt-8 text-xs text-neutral-500 font-medium uppercase tracking-widest">
          Trusted by engineers worldwide
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
      >
        <Feature icon={Shield} title="Secure" desc="Enterprise-grade privacy for your proprietary code." />
        <Feature icon={Zap} title="Fast" desc="Get comprehensive feedback in under 5 seconds." />
        <Feature icon={Sparkles} title="Expert" desc="Powered by the latest AI models." />
      </motion.div>
    </div>
  );
};

export default LoginPage;

