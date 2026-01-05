import { useState } from 'react';
import { Send, Loader, AlertTriangle, Shield, Activity } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  analysisData?: {
    risk_score: number;
    threat_level: string;
    findings: string[];
    recommendations: string[];
    target: string;
  };
}

const API_URL = 'http://localhost:8000';

export default function CoPilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'SentinelAI Co-Pilot initialized. Enter an IP address or URL for threat analysis.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setAnalyzing(true);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, {
        target: userMessage,
      });

      const { risk_score, threat_level, findings, recommendations, target } = response.data;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Analysis complete for ${target}`,
          analysisData: {
            risk_score,
            threat_level,
            findings,
            recommendations,
            target,
          },
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: Unable to analyze target. Please ensure the backend API is running.',
        },
      ]);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'High':
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'Medium':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'Low':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className="bg-[#020617]/50 border border-blue-500/20 rounded-lg backdrop-blur-sm flex flex-col h-[600px]">
      <div className="p-4 border-b border-blue-500/20">
        <h3 className="text-lg font-semibold text-white">SOC Co-Pilot</h3>
        <p className="text-sm text-gray-400">AI-powered threat intelligence assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === 'user' ? 'w-auto' : 'w-full'
              }`}
            >
              {message.role === 'user' ? (
                <div className="bg-blue-500/20 border border-blue-500/30 text-blue-100 p-3 rounded-lg">
                  <p className="font-mono text-sm">{message.content}</p>
                </div>
              ) : message.analysisData ? (
                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 ${getThreatColor(
                      message.analysisData.threat_level
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold">Threat Analysis Report</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs">Live</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Target</div>
                      <div className="font-mono text-sm">{message.analysisData.target}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Risk Score</div>
                        <div className="text-2xl font-bold">
                          {message.analysisData.risk_score}/100
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Threat Level</div>
                        <div className="text-2xl font-bold">
                          {message.analysisData.threat_level}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-white text-sm">Findings</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {message.analysisData.findings.map((finding, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 border border-green-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-white text-sm">
                        Recommendations
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {message.analysisData.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 border border-gray-700/50 text-gray-200 p-3 rounded-lg">
                  <p className="text-sm">{message.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {analyzing && (
          <div className="flex justify-start">
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-blue-400">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm font-semibold">Analyzing threat...</span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Checking threat intelligence feeds...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <span>Analyzing malware signatures...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span>Calculating risk score...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-blue-500/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter IP address or URL (e.g., 192.168.1.1 or example.com)..."
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
