import { useState, useEffect } from 'react';
import { githubService } from '../Services/githubAPI';

export const useUserData = (username) => {
  const [userData, setUserData] = useState(null);
  const [starredRepos, setStarredRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [user, starred] = await Promise.all([
          githubService.getUser(username),
          githubService.getUserStarredRepos(username)
        ]);
        
        setUserData(user);
        setStarredRepos(starred);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const getUserTopLanguages = () => {
    if (!starredRepos.length) return [];
    
    const languageCount = starredRepos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(languageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }));
  };

  return {
    userData,
    starredRepos,
    topLanguages: getUserTopLanguages(),
    loading,
    error
  };
};