import React from 'react';
import { Star, GitFork, Eye, TrendingUp } from 'lucide-react';

const DataTable = ({ onRepositoryClick }) => {
  const trendingRepos = [
    {
      id: 1,
      name: 'facebook/react',
      description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
      stars: 216000,
      forks: 45200,
      language: 'JavaScript',
      languageColor: '#f7df1e',
      trending: true,
      growth: 1250
    },
    {
      id: 2,
      name: 'vercel/next.js',
      description: 'The React Framework for Production',
      stars: 115000,
      forks: 25400,
      language: 'JavaScript',
      languageColor: '#f7df1e',
      trending: true,
      growth: 890
    },
    {
      id: 3,
      name: 'vuejs/vue',
      description: '🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
      stars: 205000,
      forks: 33800,
      language: 'JavaScript',
      languageColor: '#f7df1e',
      trending: false,
      growth: 450
    },
    {
      id: 4,
      name: 'tailwindlabs/tailwindcss',
      description: 'A utility-first CSS framework for rapid UI development.',
      stars: 72000,
      forks: 3700,
      language: 'CSS',
      languageColor: '#563d7c',
      trending: true,
      growth: 670
    },
    {
      id: 5,
      name: 'openai/openai-python',
      description: 'The OpenAI Python library provides convenient access to the OpenAI API from applications written in Python.',
      stars: 54000,
      forks: 8200,
      language: 'Python',
      languageColor: '#3776ab',
      trending: true,
      growth: 1120
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Trending Repositories</h3>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            Updated today
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Repository
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stars
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trendingRepos.map((repo) => (
              <tr 
                key={repo.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRepositoryClick(repo)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {repo.name}
                        {repo.trending && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Trending
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {repo.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    <span className="text-sm text-gray-900">{repo.language}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {repo.stars.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <GitFork className="w-4 h-4 text-blue-500 mr-1" />
                    {repo.forks.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{repo.growth.toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;