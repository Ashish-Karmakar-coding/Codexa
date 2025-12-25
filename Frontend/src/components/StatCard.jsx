import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-primary/50 transition-colors shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-neutral-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;

