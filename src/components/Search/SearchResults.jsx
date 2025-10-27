import React from 'react';
import { calculateHealthScore, calculateTrendScore } from '../../utils/analyticsCalculations';

const SearchResults = ({ results, loading, error, onRepoSelect }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No repositories found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {results.map((repo) => (
        <RepositoryCard 
          key={repo.id} 
          repo={repo} 
          onSelect={onRepoSelect}
        />
      ))}
    </div>
  );
};

const RepositoryCard = ({ repo, onSelect }) => {
  const healthScore = calculateHealthScore(repo);
  const trendScore = calculateTrendScore(repo);
  
  const getHealthColor = (score) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    if (score >= 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (score) => {
    if (score > 5) return '🚀';
    if (score > 2) return '📈';
    if (score > 0.5) return '↗️';
    return '➡️';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
      onClick={() => onSelect(repo)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {repo.owner.login}/{repo.name}
          </h3>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">{repo.stargazers_count?.toLocaleString()}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {repo.description || 'No description provided'}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0 1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514 1.514 0 0 1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35L8.66 7.73l1.925-3.862c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662 0c.25.153.45.373.577.633l1.925 3.847 4.334.615c.29.042.562.162.785.348.224.186.39.43.48.704a1.514 1.514 0 0 1-.404 1.58l-3.13 3 .736 4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582 1.582 0 0 1-1.643.117l-3.865-2-3.865 2z"/>
              </svg>
              {repo.stargazers_count?.toLocaleString()}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 1a1 1 0 0 1 1 1v1.5H14a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9.5V7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V5.5H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h4.5V2a1 1 0 0 1 1-1h1z"/>
              </svg>
              {repo.forks_count?.toLocaleString()}
            </span>
          </div>
          
          {/* Health Score */}
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1 bg-green-500"></div>
            <span className="text-xs font-medium text-gray-600">
              {Math.round(healthScore * 100)}%
            </span>
          </div>
        </div>

        {/* Language & Trend */}
        <div className="flex justify-between items-center">
          {repo.language && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {repo.language}
            </span>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">{getTrendIcon(trendScore)}</span>
            <span>Trending</span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-3 text-xs text-gray-400">
          Updated {new Date(repo.updated_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;