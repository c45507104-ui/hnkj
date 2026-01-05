import { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, {
        target: userMessage,
      });

      const { risk_score, threat_level, findings, recommendations } = response.data;

      const analysisResult = `
**Target Analysis: ${userMessage}**

**Risk Score:** ${risk_score}/100
**Threat Level:** ${threat_level}

**Findings:**
${findings.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n')}

**Recommendations:**
${recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}
      `.trim();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: analysisResult },
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
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-100'
                  : 'bg-gray-800/50 border border-gray-700/50 text-gray-200'
              }`}
            >
              <pre className="font-mono text-sm whitespace-pre-wrap">{message.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 border border-gray-700/50 p-3 rounded-lg">
              <Loader className="w-5 h-5 animate-spin text-blue-400" />
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
            placeholder="Enter IP address or URL..."
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
