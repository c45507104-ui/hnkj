import { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import axios from 'axios';

interface Threat {
  id: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  threat_type: string;
  description: string;
}

const API_URL = 'http://localhost:8000';

export default function ThreatFeed() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchThreats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/threat-feed`);
      setThreats(response.data.threats);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch threats:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-500/10 text-red-400';
      case 'high':
        return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'low':
        return 'border-blue-500 bg-blue-500/10 text-blue-400';
      default:
        return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
      {threats.map((threat) => (
        <div
          key={threat.id}
          className={`p-4 rounded-lg border backdrop-blur-sm transition-all hover:scale-[1.02] ${getSeverityColor(
            threat.severity
          )}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 mt-1" />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold uppercase">{threat.threat_type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-current">
                    {threat.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{threat.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>Source: {threat.source}</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(threat.timestamp)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
