import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import ThreatFeed from './components/ThreatFeed';
import { ThreatVolumeChart, ThreatDistributionChart } from './components/Charts';
import CoPilot from './components/CoPilot';

function App() {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="min-h-screen bg-[#020617]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          {activeView === 'overview' && (
            <div className="space-y-8">
              <Stats />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ThreatVolumeChart />
                <ThreatDistributionChart />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Live Threat Feed</h3>
                  <ThreatFeed />
                </div>
                <div>
                  <CoPilot />
                </div>
              </div>
            </div>
          )}

          {activeView === 'livefeed' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Live Threat Feed</h2>
              <ThreatFeed />
            </div>
          )}

          {activeView === 'threatmap' && (
            <div className="flex items-center justify-center h-[600px] bg-[#020617]/50 border border-blue-500/20 rounded-lg backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Threat Map</h3>
                <p className="text-gray-400">Geographic visualization coming soon</p>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-[#020617]/50 border border-blue-500/20 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Endpoint
                  </label>
                  <input
                    type="text"
                    value="http://localhost:8000"
                    readOnly
                    className="w-full px-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Refresh Interval
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg text-white">
                    <option>5 seconds</option>
                    <option>10 seconds</option>
                    <option>30 seconds</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
