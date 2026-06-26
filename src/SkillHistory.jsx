import { useState, useEffect } from 'react';

const FLOWERS = {
  'Seed': '🌱',
  'Sprout': '🌿',
  'Bud': '🌷',
  'Bloom': '🌸'
};

export default function SkillHistory({ skill, onClose }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate mock historical data for the skill
    // In a real app, this would come from your database
    const mockData = generateMockData(skill);
    setData(mockData);
  }, [skill]);

  const generateMockData = (skillName) => {
    // Generate 30 days of data
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Create some realistic ups and downs
      const baseValue = 30 + Math.sin(i / 5) * 20;
      const variance = Math.random() * 15;
      const value = Math.max(10, Math.min(100, baseValue + variance));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        progress: Math.round(value),
        flower: getFlowerLevel(value)
      });
    }
    return data;
  };

  const getFlowerLevel = (value) => {
    if (value < 25) return 'Seed';
    if (value < 50) return 'Sprout';
    if (value < 75) return 'Bud';
    return 'Bloom';
  };

  const maxValue = 100;
  const minValue = Math.min(...data.map(d => d.progress));
  const avgValue = Math.round(data.reduce((sum, d) => sum + d.progress, 0) / data.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{skill} Progress Tracker</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded"
          >
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-500">{avgValue}%</div>
            <div className="text-sm text-gray-600">Average Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-500">{data[data.length - 1]?.progress}%</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-500">{FLOWERS[data[data.length - 1]?.flower]}</div>
            <div className="text-sm text-gray-600">Current Flower</div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Sparkline-style chart */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">30-Day Progression</h3>
            <div className="flex items-end justify-between h-48 gap-1 bg-gradient-to-b from-rose-50 to-white p-4 rounded-lg border border-rose-200">
              {data.map((point, idx) => {
                const height = (point.progress / maxValue) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group"
                    title={`${point.date}: ${point.progress}%`}
                  >
                    {/* Bar */}
                    <div
                      className="w-full rounded-t transition-all duration-300 hover:bg-rose-400 bg-rose-500 opacity-75 hover:opacity-100"
                      style={{ height: `${height}%`, minHeight: height > 5 ? '4px' : '0px' }}
                    />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {point.date}: {point.progress}%
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Habit Log */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Activity</h3>
            <div className="grid grid-cols-7 gap-2">
              {data.slice(-28).map((point, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl mb-2 transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor:
                        point.progress > 75
                          ? '#fce7f3'
                          : point.progress > 50
                          ? '#fbcfe8'
                          : point.progress > 25
                          ? '#f9a8d4'
                          : '#f472b6',
                    }}
                  >
                    {FLOWERS[point.flower]}
                  </div>
                  <div className="text-xs text-gray-500">{point.date.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ You've been consistently improving in <strong>{skill}</strong></li>
              <li>✓ Current streak: <strong>5 days</strong> of activity</li>
              <li>✓ Best day: <strong>95%</strong> progress (keep it up!)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
