import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const threatVolumeData = [
  { time: '00:00', threats: 45 },
  { time: '04:00', threats: 32 },
  { time: '08:00', threats: 67 },
  { time: '12:00', threats: 89 },
  { time: '16:00', threats: 134 },
  { time: '20:00', threats: 98 },
  { time: '23:59', threats: 76 },
];

const threatDistributionData = [
  { name: 'Malware', value: 35, color: '#ef4444' },
  { name: 'Phishing', value: 28, color: '#f97316' },
  { name: 'C2', value: 22, color: '#eab308' },
  { name: 'Ransomware', value: 10, color: '#3b82f6' },
  { name: 'DDoS', value: 5, color: '#6366f1' },
];

export function ThreatVolumeChart() {
  return (
    <div className="bg-[#020617]/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Threat Volume (24h)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={threatVolumeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="threats"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ThreatDistributionChart() {
  return (
    <div className="bg-[#020617]/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Threat Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={threatDistributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {threatDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
            }}
          />
          <Legend
            wrapperStyle={{ color: '#94a3b8' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
