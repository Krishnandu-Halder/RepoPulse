import { useState, useEffect } from 'react';

export const useRepository = (owner, repo) => {
  const [repository, setRepository] = useState(null);
  const [languages, setLanguages] = useState({});
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositoryData = async () => {
      if (!owner || !repo) {
        setRepository(null);
        setLanguages({});
        setContributors([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching data for: ${owner}/${repo}`);
        
        // Fetch repository basic info
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        
        if (!repoResponse.ok) {
          if (repoResponse.status === 404) {
            throw new Error(`Repository "${owner}/${repo}" not found`);
          } else if (repoResponse.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
          } else {
            throw new Error(`Failed to fetch repository: ${repoResponse.statusText}`);
          }
        }
        
        const repoData = await repoResponse.json();
        setRepository(repoData);

        // Fetch languages
        try {
          const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
          if (languagesResponse.ok) {
            const languagesData = await languagesResponse.json();
            setLanguages(languagesData);
          }
        } catch (langError) {
          console.warn('Failed to fetch languages:', langError);
          setLanguages({});
        }

        // Fetch contributors (first page only for performance)
        try {
          const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`);
          if (contributorsResponse.ok) {
            const contributorsData = await contributorsResponse.json();
            setContributors(contributorsData || []);
          }
        } catch (contribError) {
          console.warn('Failed to fetch contributors:', contribError);
          setContributors([]);
        }

      } catch (err) {
        console.error('Error fetching repository data:', err);
        setError(err.message);
        setRepository(null);
        setLanguages({});
        setContributors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositoryData();
  }, [owner, repo]);

  return {
    repository,
    languages,
    contributors,
    loading,
    error
  };
};

// import { useState, useEffect } from 'react';
// import { githubService } from '../Services/githubAPI';

// export const useRepository = (owner, repo) => {
//   const [repository, setRepository] = useState(null);
//   const [languages, setLanguages] = useState({});
//   const [contributors, setContributors] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRepositoryData = async () => {
//       if (!owner || !repo) return;
      
//       setLoading(true);
//       setError(null);
      
//       try {
//         const [repoData, langData, contribData, topicsData] = await Promise.all([
//           githubService.getRepository(owner, repo),
//           githubService.getRepositoryLanguages(owner, repo),
//           githubService.getContributors(owner, repo),
//           githubService.getRepositoryTopics(owner, repo)
//         ]);
        
//         setRepository(repoData);
//         setLanguages(langData);
//         setContributors(contribData || []);
//         setTopics(topicsData.names || []);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch repository data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRepositoryData();
//   }, [owner, repo]);

//   return {
//     repository,
//     languages,
//     contributors,
//     topics,
//     loading,
//     error
//   };
// };

// export const useRepositorySearch = (query, filters = {}) => {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const searchRepositories = async (searchQuery, searchFilters = {}) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const params = {
//         q: searchQuery,
//         ...filters,
//         ...searchFilters
//       };
      
//       const data = await githubService.searchRepositories(params);
//       setResults(data.items || []);
//     } catch (err) {
//       setError(err.message || 'Search failed');
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     results,
//     loading,
//     error,
//     searchRepositories
//   };
// };