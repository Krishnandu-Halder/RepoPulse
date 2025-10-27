import React from 'react';
import { Star, GitFork, Users, TrendingUp } from 'lucide-react';

const StatsCards = ({ data }) => {
  const stats = [
    {
      title: 'Total Stars',
      value: data?.totalStars || '0',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      change: '+12%'
    },
    {
      title: 'Total Forks',
      value: data?.totalForks || '0',
      icon: GitFork,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '+8%'
    },
    {
      title: 'Active Users',
      value: data?.activeUsers || '0',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: '+15%'
    },
    {
      title: 'Trending Repos',
      value: data?.trendingRepos || '0',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '+23%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last week</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;