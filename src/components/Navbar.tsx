import { Home, Calendar, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'history' | 'profile';
  onTabChange: (tab: 'home' | 'history' | 'profile') => void;
  onLogout: () => void;
  userName: string;
}

export default function Navbar({ activeTab, onTabChange, onLogout, userName }: NavbarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#140C24]/90 backdrop-blur-lg border-t border-white/5 py-3 px-6 shadow-2xl flex justify-between items-center max-w-lg mx-auto rounded-t-3xl">
      <div className="flex gap-4 flex-1 justify-around">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                isActive ? 'text-purple-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <IconComp className="w-5 h-5" />
              <span className="text-[10px] tracking-wide">{tab.label}</span>
            </button>
          );
        })}

        {/* Logout tab */}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-rose-400 cursor-pointer transition-all"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">Logout</span>
        </button>
      </div>
    </nav>
  );
}
