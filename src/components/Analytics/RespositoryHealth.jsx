import React from 'react';
import { calculateHealthScore } from '../../utils/analyticsCalculations';

const RepositoryHealth = ({ repository, contributors = [] }) => {
  const healthScore = calculateHealthScore(repository, contributors);
  
  const getHealthColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthLevel = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  const metrics = [
    {
      label: 'Activity',
      value: calculateActivityScore(repository),
      description: 'Recent updates and commits'
    },
    {
      label: 'Maintenance',
      value: calculateMaintenanceScore(repository),
      description: 'Issue response and documentation'
    },
    {
      label: 'Community',
      value: calculateCommunityScore(contributors),
      description: 'Contributor diversity and engagement'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Repository Health Score</h3>
      
      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getHealthColor(healthScore)} text-2xl font-bold mb-2`}>
          {Math.round(healthScore * 100)}
        </div>
        <p className="text-lg font-medium">{getHealthLevel(healthScore)}</p>
        <p className="text-sm text-gray-600">Overall Health</p>
      </div>

      {/* Metric Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(metric.value * 100)}%
            </div>
            <div className="font-medium text-gray-900">{metric.label}</div>
            <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* Health Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Health Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {healthScore < 0.6 && (
            <li>• Consider repositories with more recent activity</li>
          )}
          {contributors.length < 3 && (
            <li>• Look for projects with multiple contributors</li>
          )}
          {!repository.has_wiki && (
            <li>• Projects with documentation are better maintained</li>
          )}
        </ul>
      </div>
    </div>
  );
};

// Helper functions (you can move these to analyticsCalculations.js)
const calculateActivityScore = (repo) => {
  const daysSinceUpdate = Math.floor((new Date() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24));
  if (daysSinceUpdate < 7) return 1.0;
  if (daysSinceUpdate < 30) return 0.8;
  if (daysSinceUpdate < 90) return 0.6;
  return 0.4;
};

const calculateMaintenanceScore = (repo) => {
  let score = 0.5;
  if (repo.has_wiki) score += 0.2;
  if (repo.has_issues) score += 0.1;
  if (repo.topics && repo.topics.length > 0) score += 0.2;
  return Math.min(score, 1);
};

const calculateCommunityScore = (contributors) => {
  if (contributors.length === 0) return 0.3;
  if (contributors.length === 1) return 0.5;
  if (contributors.length <= 3) return 0.7;
  return 0.9;
};

export default RepositoryHealth;