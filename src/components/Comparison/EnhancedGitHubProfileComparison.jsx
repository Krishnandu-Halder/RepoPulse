import React, { useState, useEffect } from 'react';
import { githubService } from '../../services/githubAPI';

const EnhancedGitHubProfileComparison = ({ username1, username2 }) => {
  const [profile1, setProfile1] = useState(null);
  const [profile2, setProfile2] = useState(null);
  const [repos1, setRepos1] = useState([]);
  const [repos2, setRepos2] = useState([]);
  const [starred1, setStarred1] = useState([]);
  const [starred2, setStarred2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!username1 || !username2) return;

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching comprehensive data for:', { username1, username2 });
        
        // Fetch all data in parallel
        const [
          user1Data, 
          user2Data, 
          repos1Data, 
          repos2Data, 
          starred1Data, 
          starred2Data
        ] = await Promise.all([
          githubService.getUser(username1),
          githubService.getUser(username2),
          githubService.getUserStarredRepos(username1).catch(() => []),
          githubService.getUserStarredRepos(username2).catch(() => []),
          // For repositories, we'll use search as a fallback
          githubService.searchRepositories({ q: `user:${username1}` }).catch(() => ({ items: [] })),
          githubService.searchRepositories({ q: `user:${username2}` }).catch(() => ({ items: [] }))
        ]);

        console.log('All data fetched successfully');

        setProfile1(user1Data);
        setProfile2(user2Data);
        setRepos1(repos1Data?.items || []);
        setRepos2(repos2Data?.items || []);
        setStarred1(starred1Data || []);
        setStarred2(starred2Data || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [username1, username2]);

  // Calculate additional metrics
  const calculateMetrics = (profile, repos, starred) => {
    if (!profile) return null;

    // Calculate total stars across all repositories
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    
    // Calculate top languages
    const languageStats = repos.reduce((stats, repo) => {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] || 0) + 1;
      }
      return stats;
    }, {});
    
    const topLanguages = Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }));

    // Calculate project diversity
    const projectTypes = {
      web: repos.filter(repo => 
        repo.topics?.includes('web') || 
        repo.name.includes('web') || 
        repo.description?.toLowerCase().includes('web')
      ).length,
      library: repos.filter(repo => 
        repo.topics?.includes('library') || 
        repo.name.includes('lib') ||
        repo.description?.toLowerCase().includes('library')
      ).length,
      tool: repos.filter(repo => 
        repo.topics?.includes('tool') || 
        repo.name.includes('cli') ||
        repo.description?.toLowerCase().includes('tool')
      ).length,
      other: repos.length // simplified for demo
    };

    return {
      totalStars,
      topLanguages,
      projectTypes,
      repoCount: repos.length,
      starredCount: starred.length,
      accountAge: new Date().getFullYear() - new Date(profile.created_at).getFullYear(),
      followerRatio: profile.followers / (profile.following || 1),
      starsPerRepo: totalStars / (repos.length || 1)
    };
  };

  const metrics1 = calculateMetrics(profile1, repos1, starred1);
  const metrics2 = calculateMetrics(profile2, repos2, starred2);

  const ProfileCard = ({ user, metrics, isDark = false }) => {
    if (!user) return null;

    const cardClasses = `card min-w-sm border transition-all duration-300 shadow-xl hover:shadow-2xl min-w-max ${
      isDark 
        ? 'border-gray-700 bg-gray-800 text-gray-50' 
        : 'border-gray-200 bg-white text-gray-800'
    }`;

    return (
      <div className={cardClasses}>
        {/* Cover Image */}
        <div className="w-full card__media rounded-t-lg overflow-hidden">
          <div className={`h-24 w-full ${
            isDark ? 'bg-linear-to-r from-gray-900 to-gray-700' : 'bg-linear-to-r from-blue-500 to-purple-600'
          }`}></div>
        </div>

        <div className="flex items-center p-6">
          <div className="relative flex flex-col items-center w-full">
            {/* Avatar */}
            <div className={`h-20 w-20 rounded-full flex items-end justify-end min-w-max absolute -top-12 border-4 ${
              isDark ? 'border-gray-800' : 'border-white'
            } shadow-lg`}>
              <img 
                className="h-20 w-20 rounded-full" 
                src={user.avatar_url} 
                alt={user.name || user.login}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.login}&background=random&color=fff&size=80`;
                }}
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col space-y-2 justify-center items-center -mt-8 w-full">
              <div className="text-center">
                <span className={`text-lg font-bold ${isDark ? 'text-gray-50' : 'text-gray-800'}`}>
                  {user.name || user.login}
                </span>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  @{user.login}
                </div>
              </div>

              {user.bio && (
                <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-2`}>
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value1, value2, description, isHigherBetter = true, format = 'number' }) => {
    const formatValue = (value) => {
      if (format === 'number') return value?.toLocaleString() || '0';
      if (format === 'decimal') return value?.toFixed(1) || '0.0';
      if (format === 'percentage') return `${((value || 0) * 100).toFixed(1)}%`;
      return value || 'N/A';
    };

    const getWinner = () => {
      if (!value1 || !value2) return 'tie';
      return isHigherBetter ? 
        (value1 > value2 ? 'user1' : 'user2') : 
        (value1 < value2 ? 'user1' : 'user2');
    };

    const winner = getWinner();

    return (
      <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
          {winner !== 'tie' && (
            <span className={`text-xs px-2 py-1 rounded ${
              winner === 'user1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {winner === 'user1' ? 'User 1' : 'User 2'} leads
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className={`text-lg font-bold ${
            winner === 'user1' ? 'text-blue-600' : 'text-gray-600'
          }`}>
            {formatValue(value1)}
          </div>
          <div className={`text-lg font-bold ${
            winner === 'user2' ? 'text-green-600' : 'text-gray-600'
          }`}>
            {formatValue(value2)}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {description}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading comprehensive profile data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-800 font-medium">Error: {error}</div>
      </div>
    );
  }

  if (!profile1 || !profile2) {
    return (
      <div className="text-center py-12 text-gray-500">
        Enter two GitHub usernames or profile URLs to compare
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Comprehensive GitHub Profile Comparison
      </h2>
      
      {/* Profile Cards */}
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full">
        <div className="flex-1">
          <ProfileCard user={profile1} metrics={metrics1} isDark={false} />
        </div>

        <div className="flex items-center justify-center lg:px-4">
          <div className="bg-linear-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg">
            VS
          </div>
        </div>

        <div className="flex-1">
          <ProfileCard user={profile2} metrics={metrics2} isDark={true} />
        </div>
      </div>

      {/* Comprehensive Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Stats */}
        <MetricCard
          title="Total Stars"
          value1={metrics1?.totalStars}
          value2={metrics2?.totalStars}
          description="Project Popularity and Community Recognition"
        />
        
        <MetricCard
          title="Followers"
          value1={profile1.followers}
          value2={profile2.followers}
          description="Community Reach and Influence"
        />
        
        <MetricCard
          title="Public Repositories"
          value1={profile1.public_repos}
          value2={profile2.public_repos}
          description="Breadth of Work and Project Count"
        />

        {/* Engagement Metrics */}
        <MetricCard
          title="Follower Ratio"
          value1={metrics1?.followerRatio}
          value2={metrics2?.followerRatio}
          description="Followers per Following (Higher = More Influence)"
          format="decimal"
        />
        
        <MetricCard
          title="Stars per Repository"
          value1={metrics1?.starsPerRepo}
          value2={metrics2?.starsPerRepo}
          description="Average Stars per Project"
          format="decimal"
        />
        
        <MetricCard
          title="Account Age (Years)"
          value1={metrics1?.accountAge}
          value2={metrics2?.accountAge}
          description="GitHub Experience and Longevity"
        />

        {/* Activity Metrics */}
        <MetricCard
          title="Following"
          value1={profile1.following}
          value2={profile2.following}
          description="Community Engagement and Networking"
        />
        
        <MetricCard
          title="Starred Repositories"
          value1={metrics1?.starredCount}
          value2={metrics2?.starredCount}
          description="Interest in Others' Work and Learning"
        />
        
        <MetricCard
          title="Repository Diversity"
          value1={metrics1?.repoCount}
          value2={metrics2?.repoCount}
          description="Total Number of Different Projects"
        />
      </div>

      {/* Top Languages Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Top Programming Languages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">{profile1.login}'s Top Languages</h4>
            <div className="space-y-2">
              {metrics1?.topLanguages?.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{lang.language}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {lang.count} repos
                  </span>
                </div>
              )) || <div className="text-gray-500 text-sm">No language data available</div>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">{profile2.login}'s Top Languages</h4>
            <div className="space-y-2">
              {metrics2?.topLanguages?.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{lang.language}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {lang.count} repos
                  </span>
                </div>
              )) || <div className="text-gray-500 text-sm">No language data available</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Key Strengths Analysis</h4>
            <ul className="space-y-2 text-gray-700">
              {profile1.followers > profile2.followers && (
                <li>• <strong>{profile1.login}</strong> has greater community influence</li>
              )}
              {metrics1?.totalStars > metrics2?.totalStars && (
                <li>• <strong>{profile1.login}</strong>'s projects are more popular</li>
              )}
              {metrics1?.accountAge > metrics2?.accountAge && (
                <li>• <strong>{profile1.login}</strong> has more GitHub experience</li>
              )}
              {profile1.public_repos > profile2.public_repos && (
                <li>• <strong>{profile1.login}</strong> maintains more projects</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Engagement Patterns</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Follower ratio: {metrics1?.followerRatio?.toFixed(1)} vs {metrics2?.followerRatio?.toFixed(1)}</li>
              <li>• Project quality: {metrics1?.starsPerRepo?.toFixed(1)} vs {metrics2?.starsPerRepo?.toFixed(1)} stars/repo</li>
              <li>• Community size: {profile1.followers + profile1.following} vs {profile2.followers + profile2.following} total connections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGitHubProfileComparison;