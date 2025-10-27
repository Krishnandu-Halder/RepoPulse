import React, { useState, useEffect } from 'react';
import { githubService } from '../../services/githubAPI';

const GitHubProfileComparison = ({ username1, username2 }) => {
  const [profile1, setProfile1] = useState(null);
  const [profile2, setProfile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    const getFallbackProfile = (username) => ({
    login: username,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000)}?v=4`,
    bio: `GitHub user ${username}`,
    followers: Math.floor(Math.random() * 1000),
    following: Math.floor(Math.random() * 500),
    public_repos: Math.floor(Math.random() * 100),
    created_at: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Unknown',
    company: null,
    twitter_username: null
  });


  useEffect(() => {
    const fetchProfiles = async () => {
      if (!username1 || !username2) return;

      setLoading(true);
      setError(null);

      try {
        const [user1Data, user2Data] = await Promise.all([
          githubService.getUser(username1),
          githubService.getUser(username2)
        ]);

        setProfile1(user1Data);
        setProfile2(user2Data);
      } catch (err) {
        setError(err.message || 'Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [username1, username2]);

  const ProfileCard = ({ user, isDark = false }) => {
    if (!user) return null;

    const cardClasses = `card min-w-sm border transition-all duration-300 shadow-xl hover:shadow-2xl min-w-max transform hover:scale-105 ${
      isDark 
        ? 'border-gray-700 bg-gray-800 text-gray-50' 
        : 'border-gray-200 bg-white text-gray-800'
    }`;

    const textClasses = {
      name: isDark ? 'text-gray-50' : 'text-gray-800',
      username: isDark ? 'text-gray-300' : 'text-gray-600',
      bio: isDark ? 'text-gray-400' : 'text-gray-500',
      stats: isDark ? 'text-gray-50' : 'text-gray-800',
      statsLabel: isDark ? 'text-gray-300' : 'text-gray-600'
    };

    const buttonClasses = {
      follow: `flex justify-center max-h-max whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg max-w-max border bg-transparent px-4 py-2 flex items-center hover:shadow-lg transition-all duration-200 ${
        isDark 
          ? 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white' 
          : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
      }`,
      sponsor: 'flex justify-center max-h-max whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-300 rounded-lg max-w-max text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 px-4 py-2 flex items-center hover:shadow-lg transition-all duration-200'
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading profiles...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-800 font-medium mb-2">⚠️ Demo Mode</div>
        <div className="text-yellow-700 text-sm mb-4">
          {error}. Showing demo data for comparison.
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

    return (
      <div className={cardClasses}>
        {/* Cover Image */}
        <div className="w-full card__media rounded-t-lg overflow-hidden">
          <div className={`h-32 w-full ${
            isDark ? 'bg-gradient-to-r from-gray-900 to-gray-700' : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}></div>
        </div>

        <div className="flex items-center p-6">
          <div className="relative flex flex-col items-center w-full">
            {/* Avatar */}
            <div className={`h-24 w-24 rounded-full relative flex items-end justify-end min-w-max absolute -top-16 border-4 ${
              isDark ? 'border-gray-800' : 'border-white'
            } shadow-lg`}>
              <img 
                className="h-24 w-24 rounded-full" 
                src={user.avatar_url} 
                alt={user.name || user.login}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.login}&background=random&color=fff&size=96`;
                }}
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* User Info */}
            <div className="flex flex-col space-y-2 justify-center items-center -mt-12 w-full">
              {/* Name and Username */}
              <div className="text-center">
                <span className={`text-xl font-bold ${textClasses.name}`}>
                  {user.name || user.login}
                </span>
                <div className={`text-md ${textClasses.username} mt-1`}>
                  @{user.login}
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className={`text-sm text-center mt-2 ${textClasses.bio} line-clamp-2`}>
                  {user.bio}
                </p>
              )}

              {/* Location and Company */}
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {user.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {user.company}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="py-3 flex space-x-3">
                <button className={buttonClasses.follow}>
                  <span className="mr-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </span>
                  FOLLOW
                </button>
                <button className={buttonClasses.sponsor}>
                  <span className="mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                  SPONSOR
                </button>
              </div>

              {/* Stats */}
              <div className="py-3 flex justify-center items-center w-full divide-x divide-gray-400 divide-solid bg-gray-50 rounded-lg">
                <div className="text-center px-4">
                  <div className={`font-bold text-lg ${textClasses.stats}`}>
                    {user.followers?.toLocaleString() || '0'}
                  </div>
                  <div className={`text-xs ${textClasses.statsLabel} mt-1`}>
                    Followers
                  </div>
                </div>
                <div className="text-center px-4">
                  <div className={`font-bold text-lg ${textClasses.stats}`}>
                    {user.following?.toLocaleString() || '0'}
                  </div>
                  <div className={`text-xs ${textClasses.statsLabel} mt-1`}>
                    Following
                  </div>
                </div>
                <div className="text-center px-4">
                  <div className={`font-bold text-lg ${textClasses.stats}`}>
                    {user.public_repos?.toLocaleString() || '0'}
                  </div>
                  <div className={`text-xs ${textClasses.statsLabel} mt-1`}>
                    Repos
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mt-2">
                {user.created_at && (
                  <div>Joined {new Date(user.created_at).getFullYear()}</div>
                )}
                {user.twitter_username && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                    </svg>
                    @{user.twitter_username}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-800 font-medium">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile1 || !profile2) {
    return (
      <div className="text-center py-12 text-gray-500">
        Enter two GitHub usernames to compare profiles
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">GitHub Profile Comparison</h2>
      
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 w-full">
        {/* User 1 Card */}
        <div className="flex-1">
          <ProfileCard user={profile1} isDark={false} />
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center lg:px-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg transform lg:rotate-0 rotate-0">
            VS
          </div>
        </div>

        {/* User 2 Card */}
        <div className="flex-1">
           <ProfileCard user={profile2} isDark={false} /> {/*here we keep isDark false for both for consistency} */}
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md text-center border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">
            {Math.abs(profile1.followers - profile2.followers).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Followers Difference</div>
          <div className="text-xs text-gray-500 mt-1">
            {profile1.followers > profile2.followers ? 
              `${profile1.login} leads` : `${profile2.login} leads`
            }
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">
            {Math.abs(profile1.public_repos - profile2.public_repos).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Repos Difference</div>
          <div className="text-xs text-gray-500 mt-1">
            {profile1.public_repos > profile2.public_repos ? 
              `${profile1.login} has more` : `${profile2.login} has more`
            }
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md text-center border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">
            {Math.abs(profile1.following - profile2.following).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Following Difference</div>
          <div className="text-xs text-gray-500 mt-1">
            {profile1.following > profile2.following ? 
              `${profile1.login} follows more` : `${profile2.login} follows more`
            }
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">
            {Math.abs(new Date(profile1.created_at).getFullYear() - new Date(profile2.created_at).getFullYear())}
          </div>
          <div className="text-sm text-gray-600">Years Difference</div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(profile1.created_at) < new Date(profile2.created_at) ? 
              `${profile1.login} is older` : `${profile2.login} is older`
            }
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Detailed Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Strengths</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              {profile1.followers > profile2.followers && (
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <strong>{profile1.login}</strong> has more followers
                </li>
              )}
              {profile1.public_repos > profile2.public_repos && (
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <strong>{profile1.login}</strong> has more public repositories
                </li>
              )}
              {new Date(profile1.created_at) < new Date(profile2.created_at) && (
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <strong>{profile1.login}</strong> has longer GitHub presence
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Community Engagement</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex justify-between">
                <span>Follower Ratio:</span>
                <span>{((profile1.followers / (profile1.following || 1)) * 100).toFixed(1)}% vs {((profile2.followers / (profile2.following || 1)) * 100).toFixed(1)}%</span>
              </li>
              <li className="flex justify-between">
                <span>Repo per Year:</span>
                <span>{(profile1.public_repos / (new Date().getFullYear() - new Date(profile1.created_at).getFullYear())).toFixed(1)} vs {(profile2.public_repos / (new Date().getFullYear() - new Date(profile2.created_at).getFullYear())).toFixed(1)}</span>
              </li>
              <li className="flex justify-between">
                <span>Account Age:</span>
                <span>{new Date().getFullYear() - new Date(profile1.created_at).getFullYear()}y vs {new Date().getFullYear() - new Date(profile2.created_at).getFullYear()}y</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubProfileComparison;