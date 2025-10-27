import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import Charts from '../components/Dashboard/Charts';
import DataTable from '../components/Dashboard/DataTable';

const Dashboard = ({ onNavigate }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch this from your backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          totalStars: '1.2M',
          totalForks: '245K',
          activeUsers: '15.7K',
          trendingRepos: '48'
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRepositoryClick = (repository) => {
    if (onNavigate) {
      onNavigate('analytics', { repoUrl: repository.name });
    }
  };

  if (loading) {
    return (
      <div className="min-h-full py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full py-[-100px] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-2 text-lg text-gray-600">
            Real-time insights and analytics for GitHub repositories
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards data={dashboardData} />

        {/* Charts */}
        <Charts data={dashboardData} />

        {/* Trending Repositories Table */}
        <DataTable onRepositoryClick={handleRepositoryClick} />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate?.('search')}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              Search Repositories
            </h3>
            <p className="text-gray-600 mt-2">
              Discover new repositories by technology, topic, or popularity
            </p>
          </button>

          <button
            onClick={() => onNavigate?.('compare')}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
              Compare Repositories
            </h3>
            <p className="text-gray-600 mt-2">
              Side-by-side comparison of repositories and developer profiles
            </p>
          </button>

          <button
            onClick={() => onNavigate?.('analytics')}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
              Repository Analytics
            </h3>
            <p className="text-gray-600 mt-2">
              Deep insights into repository health and community engagement
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;