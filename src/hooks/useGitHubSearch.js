import { useState, useEffect } from 'react';
import { githubService } from '../Services/githubAPI';

export const useGitHubSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRepositories = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const defaultFilters = {
        sort: 'stars',
        order: 'desc',
        per_page: 30,
        ...filters
      };
      
      const data = await githubService.searchRepositories(defaultFilters);
      setResults(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    searchRepositories
  };
};