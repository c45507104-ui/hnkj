import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Header() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    try {
      await axios.get(`${API_URL}/`, { timeout: 3000 });
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    }
  };

  return (
    <div className="bg-[#020617]/80 border-b border-blue-500/20 backdrop-blur-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Threat Intelligence Dashboard</h2>
          <p className="text-sm text-gray-400">Real-time security monitoring & analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400 font-medium">API Online</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400 font-medium">API Offline</span>
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
