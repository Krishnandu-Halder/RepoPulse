import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Charts = ({ data }) => {
  const languageData = [
    { name: 'JavaScript', value: 35, color: '#f7df1e' },
    { name: 'Python', value: 25, color: '#3776ab' },
    { name: 'TypeScript', value: 15, color: '#3178c6' },
    { name: 'Java', value: 12, color: '#ed8b00' },
    { name: 'Go', value: 8, color: '#00add8' },
    { name: 'Other', value: 5, color: '#6c757d' }
  ];

  const activityData = [
    { day: 'Mon', commits: 45, prs: 12 },
    { day: 'Tue', commits: 52, prs: 15 },
    { day: 'Wed', commits: 48, prs: 10 },
    { day: 'Thu', commits: 60, prs: 18 },
    { day: 'Fri', commits: 55, prs: 14 },
    { day: 'Sat', commits: 30, prs: 8 },
    { day: 'Sun', commits: 25, prs: 6 }
  ];

  const repositoryGrowth = [
    { month: 'Jan', stars: 1200, forks: 300 },
    { month: 'Feb', stars: 1800, forks: 450 },
    { month: 'Mar', stars: 2200, forks: 600 },
    { month: 'Apr', stars: 2800, forks: 750 },
    { month: 'May', stars: 3500, forks: 900 },
    { month: 'Jun', stars: 4200, forks: 1100 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Language Distribution */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={languageData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {languageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="commits" fill="#3b82f6" name="Commits" />
            <Bar dataKey="prs" fill="#10b981" name="Pull Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Repository Growth */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={repositoryGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="stars" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Stars"
            />
            <Line 
              type="monotone" 
              dataKey="forks" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Forks"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;