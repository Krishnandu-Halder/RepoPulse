import React from 'react';
import { formatNumber } from '../../utils/formatters';

const ContributorsStats = ({ contributors = [] }) => {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Contributors</h3>
        <p className="text-gray-500 text-center py-4">No contributor data available</p>
      </div>
    );
  }

  const topContributors = contributors.slice(0, 5);
  const totalContributions = contributors.reduce((sum, contrib) => sum + contrib.contributions, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
      
      {/* Summary */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-green-900">Total Contributors</span>
          <span className="text-2xl font-bold text-green-600">
            {formatNumber(contributors.length)}
          </span>
        </div>
        <div className="mt-2 text-sm text-green-700">
          {formatNumber(totalContributions)} total contributions
        </div>
      </div>

      {/* Contributors List */}
      <div className="space-y-4">
        {topContributors.map((contributor, index) => (
          <div key={contributor.login} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={contributor.avatar_url}
                  alt={contributor.login}
                />
              </div>
              <div>
                <div className="font-medium text-gray-900">{contributor.login}</div>
                <div className="text-sm text-gray-500">
                  {formatNumber(contributor.contributions)} contributions
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {((contributor.contributions / totalContributions) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {contributors.length > 5 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          +{contributors.length - 5} more contributors
        </div>
      )}

      {/* Contribution Distribution */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Contribution Distribution</h4>
        <div className="space-y-2">
          {topContributors.map((contributor) => (
            <div key={contributor.login} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{contributor.login}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(contributor.contributions / totalContributions) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-gray-600 w-12 text-right">
                  {((contributor.contributions / totalContributions) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributorsStats;