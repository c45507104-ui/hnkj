import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity, Server } from 'lucide-react';
import axios from 'axios';

interface StatsData {
  total_alerts: number;
  active_ransomware: number;
  system_health: number;
  blocked_threats: number;
  monitored_endpoints: number;
}

const API_URL = 'http://localhost:8000';

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#020617]/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm animate-pulse"
          >
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Alerts',
      value: stats.total_alerts,
      icon: AlertTriangle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Active Ransomware',
      value: stats.active_ransomware,
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      label: 'System Health',
      value: `${stats.system_health}%`,
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Monitored Endpoints',
      value: stats.monitored_endpoints,
      icon: Server,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`bg-[#020617]/50 border ${stat.borderColor} rounded-lg p-6 backdrop-blur-sm hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
