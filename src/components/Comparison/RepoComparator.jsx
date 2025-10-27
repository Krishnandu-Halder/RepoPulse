import React from 'react';

const RepoComparator = ({ repo1, repo2 }) => {
  // Use actual repo data passed as props
  const comparisonData = {
    repo1: {
      name: repo1?.name || 'Repository 1',
      full_name: repo1?.full_name || 'owner/repo1',
      stars: repo1?.stargazers_count || 0,
      forks: repo1?.forks_count || 0,
      issues: repo1?.open_issues_count || 0,
      watchers: repo1?.watchers_count || 0,
      size: repo1?.size || 0,
      lastUpdate: repo1?.updated_at ? new Date(repo1.updated_at).toLocaleDateString() : 'Unknown',
      language: repo1?.language || 'Not specified',
      description: repo1?.description || 'No description available',
      license: repo1?.license?.name || 'No license',
      default_branch: repo1?.default_branch || 'main'
    },
    repo2: {
      name: repo2?.name || 'Repository 2',
      full_name: repo2?.full_name || 'owner/repo2',
      stars: repo2?.stargazers_count || 0,
      forks: repo2?.forks_count || 0,
      issues: repo2?.open_issues_count || 0,
      watchers: repo2?.watchers_count || 0,
      size: repo2?.size || 0,
      lastUpdate: repo2?.updated_at ? new Date(repo2.updated_at).toLocaleDateString() : 'Unknown',
      language: repo2?.language || 'Not specified',
      description: repo2?.description || 'No description available',
      license: repo2?.license?.name || 'No license',
      default_branch: repo2?.default_branch || 'main'
    }
  };

  const metrics = [
    { key: 'stars', label: 'Stars', higherIsBetter: true },
    { key: 'forks', label: 'Forks', higherIsBetter: true },
    { key: 'issues', label: 'Open Issues', higherIsBetter: false },
    { key: 'watchers', label: 'Watchers', higherIsBetter: true },
    { key: 'size', label: 'Size (KB)', higherIsBetter: false, format: (val) => val }
  ];

  const getWinner = (value1, value2, higherIsBetter) => {
    if (value1 === value2) return 'tie';
    if (higherIsBetter) return value1 > value2 ? 'repo1' : 'repo2';
    return value1 < value2 ? 'repo1' : 'repo2';
  };

  const formatValue = (value, key) => {
    if (key === 'size') return value.toLocaleString();
    return value.toLocaleString();
  };

  const calculatePercentage = (value1, value2) => {
    const total = value1 + value2;
    return total === 0 ? 50 : (value1 / total) * 100;
  };

  const generateSummary = () => {
    const points = [];
    
    if (comparisonData.repo1.stars !== comparisonData.repo2.stars) {
      const winner = comparisonData.repo1.stars > comparisonData.repo2.stars ? 'repo1' : 'repo2';
      points.push(`• ${comparisonData[winner].name} has more stars (${comparisonData[winner].stars.toLocaleString()})`);
    }

    if (comparisonData.repo1.forks !== comparisonData.repo2.forks) {
      const winner = comparisonData.repo1.forks > comparisonData.repo2.forks ? 'repo1' : 'repo2';
      points.push(`• ${comparisonData[winner].name} has more forks (${comparisonData[winner].forks.toLocaleString()})`);
    }

    if (comparisonData.repo1.issues !== comparisonData.repo2.issues) {
      const winner = comparisonData.repo1.issues < comparisonData.repo2.issues ? 'repo1' : 'repo2';
      points.push(`• ${comparisonData[winner].name} has fewer open issues (${comparisonData[winner].issues.toLocaleString()})`);
    }

    if (comparisonData.repo1.language === comparisonData.repo2.language && comparisonData.repo1.language !== 'Not specified') {
      points.push(`• Both repositories use ${comparisonData.repo1.language}`);
    } else if (comparisonData.repo1.language !== comparisonData.repo2.language) {
      points.push(`• Different primary languages: ${comparisonData.repo1.language} vs ${comparisonData.repo2.language}`);
    }

    if (comparisonData.repo1.lastUpdate && comparisonData.repo2.lastUpdate) {
      const date1 = new Date(repo1?.updated_at);
      const date2 = new Date(repo2?.updated_at);
      if (date1 > date2) {
        points.push(`• ${comparisonData.repo1.name} was updated more recently`);
      } else if (date2 > date1) {
        points.push(`• ${comparisonData.repo2.name} was updated more recently`);
      }
    }

    return points.length > 0 ? points : ['• Both repositories have similar metrics'];
  };

  if (!repo1 || !repo2) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Repository Comparison</h3>
        <p className="text-gray-600">Please select two repositories to compare</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Repository Comparison Results</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Repo 1 */}
        <div className="text-center">
          <div className="font-semibold text-lg text-blue-600 mb-2">
            {comparisonData.repo1.full_name}
          </div>
          <div className="text-sm text-gray-600">{comparisonData.repo1.language}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{comparisonData.repo1.description}</div>
          <div className="text-xs text-gray-400 mt-2">Updated: {comparisonData.repo1.lastUpdate}</div>
        </div>

        {/* VS */}
        <div className="text-center flex items-center justify-center">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            VS
          </span>
        </div>

        {/* Repo 2 */}
        <div className="text-center">
          <div className="font-semibold text-lg text-green-600 mb-2">
            {comparisonData.repo2.full_name}
          </div>
          <div className="text-sm text-gray-600">{comparisonData.repo2.language}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{comparisonData.repo2.description}</div>
          <div className="text-xs text-gray-400 mt-2">Updated: {comparisonData.repo2.lastUpdate}</div>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="space-y-4">
        {metrics.map((metric) => {
          const value1 = comparisonData.repo1[metric.key];
          const value2 = comparisonData.repo2[metric.key];
          const winner = getWinner(value1, value2, metric.higherIsBetter);
          const percentage = calculatePercentage(value1, value2);
          
          return (
            <div key={metric.key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-center font-medium text-gray-700 mb-2">
                {metric.label}
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Repo 1 Value */}
                <div className={`text-right text-lg font-semibold ${
                  winner === 'repo1' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {formatValue(value1, metric.key)}
                </div>

                {/* Comparison Bar */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Repo 2 Value */}
                <div className={`text-left text-lg font-semibold ${
                  winner === 'repo2' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {formatValue(value2, metric.key)}
                </div>
              </div>

              {/* Winner Indicator */}
              {winner !== 'tie' && (
                <div className="text-center mt-2">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    winner === 'repo1' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {winner === 'repo1' ? comparisonData.repo1.name : comparisonData.repo2.name} leads
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Repository Summary */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-2">Repository Comparison Summary</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          {generateSummary().map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Additional Info */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="text-center">
          <div className="font-medium">License</div>
          <div>{comparisonData.repo1.license}</div>
        </div>
        <div className="text-center">
          <div className="font-medium">License</div>
          <div>{comparisonData.repo2.license}</div>
        </div>
      </div>
    </div>
  );
};

export default RepoComparator;