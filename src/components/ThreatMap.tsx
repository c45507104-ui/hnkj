import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface ThreatMapData {
  id: string;
  lat: number;
  lng: number;
  country: string;
  severity: string;
  threat_type: string;
  description: string;
  ip_address: string;
  timestamp: string;
}

export default function ThreatMap() {
  const [threats, setThreats] = useState<ThreatMapData[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatMapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchThreats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/threat-map`);
      setThreats(response.data.threats);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch threat map:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#3b82f6';
      default:
        return '#6366f1';
    }
  };

  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) * 800) / 360;
    const y = ((90 - lat) * 400) / 180;
    return { x, y };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#020617]/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Global Threat Map</h2>
          <p className="text-sm text-gray-400">Real-time threat locations worldwide</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-400">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-400">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-400">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-400">Low</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-900/50 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-auto"
          style={{ minHeight: '400px' }}
        >
          <rect width="800" height="400" fill="#0a0f1e" />

          <g opacity="0.1">
            {Array.from({ length: 40 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={i * 20}
                y1="0"
                x2={i * 20}
                y2="400"
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 20 }, (_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 20}
                x2="800"
                y2={i * 20}
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            ))}
          </g>

          <text x="400" y="200" textAnchor="middle" fill="#1e293b" fontSize="120" fontWeight="bold">
            WORLD MAP
          </text>

          {threats.map((threat) => {
            const pos = projectCoordinates(threat.lat, threat.lng);
            const color = getSeverityColor(threat.severity);

            return (
              <g key={threat.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill={color}
                  opacity="0.8"
                  className="cursor-pointer transition-all hover:r-6"
                  onClick={() => setSelectedThreat(threat)}
                >
                  <animate
                    attributeName="r"
                    values="4;8;4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="12"
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    values="12;24;12"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {selectedThreat && (
          <div className="absolute top-4 right-4 max-w-sm bg-gray-900/95 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-bold text-white">
                  {selectedThreat.threat_type}
                </span>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <div>
                <span className="text-gray-500">ID:</span> {selectedThreat.id}
              </div>
              <div>
                <span className="text-gray-500">IP:</span> {selectedThreat.ip_address}
              </div>
              <div>
                <span className="text-gray-500">Country:</span> {selectedThreat.country}
              </div>
              <div>
                <span className="text-gray-500">Severity:</span>{' '}
                <span
                  className="px-2 py-0.5 rounded-full border border-current uppercase"
                  style={{ color: getSeverityColor(selectedThreat.severity) }}
                >
                  {selectedThreat.severity}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Description:</span>
                <p className="mt-1">{selectedThreat.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-3 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">{threats.length}</div>
          <div className="text-xs text-gray-400">Active Threats</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">
            {threats.filter((t) => t.severity === 'critical').length}
          </div>
          <div className="text-xs text-gray-400">Critical</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 border border-orange-500/20">
          <div className="text-2xl font-bold text-orange-400">
            {threats.filter((t) => t.severity === 'high').length}
          </div>
          <div className="text-xs text-gray-400">High Severity</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">
            {new Set(threats.map((t) => t.country)).size}
          </div>
          <div className="text-xs text-gray-400">Countries</div>
        </div>
      </div>
    </div>
  );
}
