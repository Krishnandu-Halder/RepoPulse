import React, { useState, useEffect } from 'react';
import { useRepositorySearch } from '../hooks/useRepositorySearch';
import SearchBar from '../components/UI/SearchBar';
import AdvancedFilters from '../components/Search/AdvancedFilters';
import SearchResults from '../components/Search/SearchResults';

const Search = ({ onNavigate, initialState }) => {
  console.log('Search page rendered with props:', { onNavigate: !!onNavigate, initialState });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    language: '',
    minStars: '',
    minForks: '',
    topic: '',
    sort: 'stars',
    order: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Use the search hook
  const { results, loading, error, totalCount, hasMore } = useRepositorySearch(
    searchQuery, 
    filters, 
    currentPage
  );

  // Check if search query was passed from navigation
  useEffect(() => {
    if (initialState?.searchQuery) {
      console.log('Setting search query from initialState:', initialState.searchQuery);
      setSearchQuery(initialState.searchQuery);
    }
  }, [initialState]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleResultClick = (repository) => {
    if (onNavigate) {
      onNavigate('analytics', { repoUrl: repository.html_url || repository.full_name });
    }
  };

  const handleCompareClick = (repository) => {
    if (onNavigate) {
      onNavigate('compare', { repo1: repository.full_name });
    }
  };

  const popularSearches = [
    { query: 'react', label: 'React' },
    { query: 'vue', label: 'Vue.js' },
    { query: 'machine learning', label: 'Machine Learning' },
    { query: 'web framework', label: 'Web Frameworks' },
    { query: 'blockchain', label: 'Blockchain' },
    { query: 'mobile app', label: 'Mobile Apps' }
  ];

  const quickFilters = [
    { language: 'javascript', label: 'JavaScript' },
    { language: 'python', label: 'Python' },
    { language: 'typescript', label: 'TypeScript' },
    { language: 'java', label: 'Java' },
    { minStars: '1000', label: '1K+ Stars' },
    { minStars: '10000', label: '10K+ Stars' }
  ];

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleQuickFilter = (filter) => {
    setFilters(prev => ({ ...prev, ...filter }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900">Discover Repositories</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Search through millions of GitHub repositories. Find projects by technology, topic, or popularity.
          </p>
        </div>

        {/* Main Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar 
                onSearch={handleSearch}
                initialValue={searchQuery}
                placeholder="Search repositories by name, description, or topics..."
              />
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Quick Searches */}
        {!searchQuery && !loading && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search.query)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  {search.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        {searchQuery && !loading && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickFilter(filter)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  {filter.label}
                </button>
              ))}
              <button
                onClick={() => setFilters({
                  language: '',
                  minStars: '',
                  minForks: '',
                  topic: '',
                  sort: 'stars',
                  order: 'desc'
                })}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        <SearchResults
          results={results}
          loading={loading}
          totalCount={totalCount}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onResultClick={handleResultClick}
          onCompareClick={handleCompareClick}
          searchQuery={searchQuery}
        />

        {/* Empty State */}
        {!searchQuery && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Exploring</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a search term above or try one of the popular searches to discover amazing GitHub repositories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

