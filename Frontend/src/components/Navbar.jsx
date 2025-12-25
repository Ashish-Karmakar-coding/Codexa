import { Search, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-neutral-950"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.username || 'User'}</p>
            <p className="text-xs text-neutral-500">Developer</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

