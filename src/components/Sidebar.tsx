import { Shield, Activity, Map, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'livefeed', label: 'Live Feed', icon: Activity },
    { id: 'threatmap', label: 'Threat Map', icon: Map },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#020617] border-r border-blue-500/20 backdrop-blur-xl">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">SentinelAI</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
