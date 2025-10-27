import { useState, useEffect } from 'react';

export const useRepositorySearch = (query, filters = {}, page = 1) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const searchRepositories = async () => {
      if (!query.trim()) {
        setResults([]);
        setTotalCount(0);
        setHasMore(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Build search query with filters
        let searchQuery = query;
        
        // Add language filter
        if (filters.language) {
          searchQuery += ` language:${filters.language}`;
        }
        
        // Add stars filter
        if (filters.minStars) {
          searchQuery += ` stars:>=${filters.minStars}`;
        }
        
        // Add forks filter
        if (filters.minForks) {
          searchQuery += ` forks:>=${filters.minForks}`;
        }
        
        // Add topic filter
        if (filters.topic) {
          searchQuery += ` topic:${filters.topic}`;
        }

        const perPage = 30;
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${filters.sort || 'stars'}&order=${filters.order || 'desc'}&page=${page}&per_page=${perPage}`;

        console.log('Searching with URL:', url);

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
          } else if (response.status === 422) {
            throw new Error('Invalid search query. Please try different search terms.');
          } else {
            throw new Error(`Search failed: ${response.statusText}`);
          }
        }

        const data = await response.json();
        setResults(data.items || []);
        setTotalCount(data.total_count || 0);
        setHasMore(data.items && data.items.length === perPage);

      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
        setResults([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    searchRepositories();
  }, [query, filters, page]);

  return {
    results,
    loading,
    error,
    totalCount,
    hasMore
  };
};