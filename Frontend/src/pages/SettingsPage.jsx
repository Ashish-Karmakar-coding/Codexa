import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard } from 'lucide-react';

const SettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-neutral-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2 block">
                Username
              </label>
              <input
                type="text"
                className="w-full bg-neutral-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/50"
                placeholder="Your username"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2 block">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-neutral-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/50"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-neutral-300">Email notifications</span>
              <input type="checkbox" className="w-4 h-4 rounded bg-neutral-800" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-neutral-300">Review completion alerts</span>
              <input type="checkbox" className="w-4 h-4 rounded bg-neutral-800" defaultChecked />
            </label>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Security</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-4">
            Your account is secured with GitHub OAuth authentication.
          </p>
          <button className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors">
            Manage Permissions
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;

