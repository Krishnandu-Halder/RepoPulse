import React, { useState, useEffect } from 'react';
import RepositoryHealth from '../components/Analytics/RespositoryHealth';
import TechStack from '../components/Analytics/TechStack';
import ContributorsStats from '../components/Analytics/ContributorsStats';
import { useRepository } from '../hooks/useRepositories';

const Analytics = ({ onNavigate, initialState }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [currentOwner, setCurrentOwner] = useState('');
  const [currentRepo, setCurrentRepo] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use the repository hook with current owner/repo
  const { repository, languages, contributors, loading, error } = useRepository(currentOwner, currentRepo);

  // Check if repo URL was passed from navigation
  useEffect(() => {
    if (initialState?.repoUrl) {
      console.log('Setting repo from initialState:', initialState.repoUrl);
      setRepoUrl(initialState.repoUrl);
      handleUrlAnalysis(initialState.repoUrl);
    }
  }, [initialState]);

  const extractOwnerAndRepo = (url) => {
    console.log('Extracting from URL:', url);
    
    let owner = '';
    let repo = '';

    // Handle full GitHub URLs
    const urlMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (urlMatch) {
      owner = urlMatch[1];
      repo = urlMatch[2].replace(/\?.*$/, '').replace(/#.*$/, ''); // Remove query params and fragments
    } 
    // Handle owner/repo format
    else if (url.includes('/')) {
      const parts = url.split('/');
      if (parts.length >= 2) {
        owner = parts[0].trim();
        repo = parts[1].trim().replace(/\?.*$/, '').replace(/#.*$/, '');
      }
    }
    // Handle just repo name (assume it's from popular list)
    else if (url.startsWith('http')) {
      // If it's a URL but not GitHub, try to extract from path
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(part => part);
        if (pathParts.length >= 2) {
          owner = pathParts[0];
          repo = pathParts[1];
        }
      } catch (e) {
        console.warn('Invalid URL format:', url);
      }
    }

    console.log('Extracted owner/repo:', owner, repo);
    return { owner, repo };
  };

  const handleUrlAnalysis = (url) => {
    if (!url.trim()) {
      alert('Please enter a repository URL');
      return;
    }

    setIsAnalyzing(true);
    setAnalyticsData(null);

    const { owner, repo } = extractOwnerAndRepo(url);
    
    if (!owner || !repo) {
      setAnalyticsData(null);
      setIsAnalyzing(false);
      alert('Could not extract owner and repository from the URL. Please use format: "owner/repo" or "https://github.com/owner/repo"');
      return;
    }

    console.log('Setting current owner/repo for analysis:', owner, repo);
    setCurrentOwner(owner);
    setCurrentRepo(repo);
  };

  const handleAnalyze = () => {
    handleUrlAnalysis(repoUrl);
  };

  // Update analytics data when repository data is loaded
  useEffect(() => {
    if (repository && !loading && !error) {
      console.log('Repository data loaded, setting analytics data');
      setAnalyticsData({
        repository,
        languages,
        contributors,
        topics: repository.topics || []
      });
      setIsAnalyzing(false);
    }
  }, [repository, languages, contributors, loading, error]);

  // Handle errors
  useEffect(() => {
    if (error && isAnalyzing) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
    }
  }, [error, isAnalyzing]);

  const popularRepos = [
    { 
      name: 'React', 
      url: 'facebook/react',
      description: 'A JavaScript library for building user interfaces'
    },
    { 
      name: 'Vue.js', 
      url: 'vuejs/vue',
      description: 'The Progressive JavaScript Framework'
    },
    { 
      name: 'TypeScript', 
      url: 'microsoft/TypeScript',
      description: 'TypeScript is a superset of JavaScript'
    }
  ];

  const handleQuickAnalyze = (url) => {
    setRepoUrl(url);
    handleUrlAnalysis(url);
  };

  // Determine if we should show loading state
  const showLoading = isAnalyzing || (loading && currentOwner && currentRepo);

  return (
    <div className="min-h-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900">Repository Analytics</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get deep insights into repository health, technology stack, community engagement, and maintenance quality
          </p>
        </div>

        {/* Repository Input */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="facebook/react or https://github.com/facebook/react"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnalyze();
                }
              }}
            />
            <button
              onClick={handleAnalyze}
              disabled={showLoading || !repoUrl.trim()}
              className="bg-green-500 text-white py-2 px-8 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold whitespace-nowrap"
            >
              {showLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Repository'
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Enter a GitHub repository in format: <code>owner/repo</code> or full GitHub URL
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
            <p className="text-red-700 text-sm mt-2">
              Please check the repository name and try again. Make sure it exists and is publicly accessible.
            </p>
          </div>
        )}

        {/* Analytics Results */}
        {analyticsData && !showLoading && (
          <div>
            {/* Repository Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {analyticsData.repository.full_name}
                  </h2>
                  <p className="text-gray-600 mt-1">{analyticsData.repository.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analyticsData.topics.map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {analyticsData.repository.stargazers_count?.toLocaleString()} ⭐
                  </div>
                  <div className="text-sm text-gray-500">
                    {analyticsData.repository.forks_count?.toLocaleString()} Forks
                  </div>
                  <div className="text-sm text-gray-500">
                    {analyticsData.repository.open_issues_count?.toLocaleString()} Open Issues
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <RepositoryHealth 
                  repository={analyticsData.repository}
                  contributors={analyticsData.contributors}
                />
              </div>

              <div className="lg:col-span-1">
                <TechStack languages={analyticsData.languages} />
              </div>

              <div className="lg:col-span-1">
                <ContributorsStats contributors={analyticsData.contributors} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onNavigate?.('compare', { 
                  repo1: analyticsData.repository.full_name 
                })}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors text-center"
              >
                Compare with Another Repo
              </button>
              <button
                onClick={() => onNavigate?.('search')}
                className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors text-center"
              >
                Search Similar Repositories
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {showLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900">Analyzing Repository</h3>
            <p className="text-gray-600 mt-2">Fetching data for: {currentOwner}/{currentRepo}</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few seconds...</p>
          </div>
        )}

        {/* Example Repositories */}
        {!analyticsData && !showLoading && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Try Popular Repositories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularRepos.map((repo, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAnalyze(repo.url)}
                  className="p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-green-300 text-left group"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-green-600 text-lg">
                    {repo.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {repo.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 truncate">
                    {repo.url}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;