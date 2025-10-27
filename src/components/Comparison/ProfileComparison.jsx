import React from 'react';

const ProfileComparison = ({ user1, user2 }) => {
  // Default data structure
  const defaultUser1 = {
    name: 'Brahim',
    username: 'boussadjra',
    bio: "I can't start my day without a coffee cup",
    avatar: 'https://avatars3.githubusercontent.com/u/11801238?v=4',
    coverImage: 'https://image.freepik.com/free-vector/abstract-binary-code-techno-background_1048-12836.jpg',
    followers: 56,
    following: 112,
    repos: 27,
    isFollowing: false
  };

  const defaultUser2 = {
    name: 'Brahim',
    username: 'boussadjra',
    bio: "I can't start my day without a coffee cup",
    avatar: 'https://avatars3.githubusercontent.com/u/11801238?v=4',
    coverImage: 'https://image.freepik.com/free-vector/abstract-binary-code-techno-background_1048-12836.jpg',
    followers: 56,
    following: 112,
    repos: 27,
    isFollowing: false
  };

  const userData1 = { ...defaultUser1, ...user1 };
  const userData2 = { ...defaultUser2, ...user2 };

  const ProfileCard = ({ user, isDark = false }) => {
    const cardClasses = `card min-w-sm border transition-shadow shadow-xl hover:shadow-xl min-w-max ${
      isDark 
        ? 'border-gray-700 bg-gray-700 text-gray-50' 
        : 'border-gray-100 bg-purple-100 text-gray-800'
    }`;

    const textClasses = {
      name: isDark ? 'text-gray-50' : 'text-gray-800',
      username: isDark ? 'text-gray-100' : 'text-gray-600',
      bio: isDark ? 'text-gray-200' : 'text-gray-500',
      stats: isDark ? 'text-gray-50' : 'text-gray-700',
      statsLabel: isDark ? 'text-gray-100' : 'text-gray-600'
    };

    const buttonClasses = {
      follow: `flex justify-center max-h-max whitespace-nowrap focus:outline-none focus:ring focus:border-blue-300 rounded max-w-max border bg-transparent px-4 py-1 flex items-center hover:shadow-lg ${
        isDark 
          ? 'border-purple-400 text-purple-400 hover:border-purple-500' 
          : 'border-purple-700 text-purple-700 hover:border-purple-800'
      }`,
      sponsor: 'flex justify-center max-h-max whitespace-nowrap focus:outline-none focus:ring focus:border-blue-300 rounded max-w-max text-gray-100 bg-green-500 hover:bg-green-600 px-4 py-1 flex items-center hover:shadow-lg'
    };

    return (
      <div className={cardClasses}>
        {/* Cover Image */}
        <div className="w-full card__media">
          <img 
            src={user.coverImage} 
            alt={`${user.name}'s cover`}
            className="h-48 w-full object-cover"
          />
        </div>

        <div className="flex items-center p-4">
          <div className="relative flex flex-col items-center w-full">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full relative avatar flex items-end justify-end text-purple-600 min-w-max absolute -top-16 flex bg-purple-200 text-purple-100 row-start-1 row-end-3 text-purple-650 ring-2 ring-white">
              <img 
                className="h-24 w-24 rounded-full relative" 
                src={user.avatar} 
                alt={user.name}
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col space-y-1 justify-center items-center -mt-12 w-full">
              {/* Name and Username */}
              <span className={`text-lg font-semibold ${textClasses.name}`}>
                {user.name}
              </span>
              <span className={`text-md ${textClasses.username}`}>
                @{user.username}
              </span>

              {/* Bio */}
              <p className={`text-sm text-center mt-2 ${textClasses.bio}`}>
                {user.bio}
              </p>

              {/* Action Buttons */}
              <div className="py-3 flex space-x-2">
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
                    <svg height="20" width="20" viewBox="0 0 32 32" className="fill-current text-red-100">
                      <path d="M22.5,4c-2,0-3.9,0.8-5.3,2.2L16,7.4l-1.1-1.1C12,3.3,7.2,3.3,4.3,6.2c0,0-0.1,0.1-0.1,0.1c-3,3-3,7.8,0,10.8L16,29l11.8-11.9c3-3,3-7.8,0-10.8C26.4,4.8,24.5,4,22.5,4z"></path>
                    </svg>
                  </span>
                  SPONSOR
                </button>
              </div>

              {/* Stats */}
              <div className="py-3 flex justify-center items-center w-full divide-x divide-gray-400 divide-solid">
                <span className="text-center px-3">
                  <span className={`font-bold ${textClasses.stats}`}>
                    {user.followers?.toLocaleString()}
                  </span>
                  <span className={`text-sm ml-1 ${textClasses.statsLabel}`}>
                    followers
                  </span>
                </span>
                <span className="text-center px-3">
                  <span className={`font-bold ${textClasses.stats}`}>
                    {user.following?.toLocaleString()}
                  </span>
                  <span className={`text-sm ml-1 ${textClasses.statsLabel}`}>
                    following
                  </span>
                </span>
                <span className="text-center px-3">
                  <span className={`font-bold ${textClasses.stats}`}>
                    {user.repos?.toLocaleString()}
                  </span>
                  <span className={`text-sm ml-1 ${textClasses.statsLabel}`}>
                    repos
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Profile Comparison</h2>
      
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 w-full">
        {/* User 1 Card */}
        <div className="flex-1">
          <ProfileCard user={userData1} isDark={false} />
        </div>

        {/* VS Badge for larger screens */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold transform -rotate-12 shadow-lg">
            VS
          </div>
        </div>

        {/* VS Badge for mobile */}
        <div className="lg:hidden flex justify-center">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
            VS
          </div>
        </div>

        {/* User 2 Card */}
        <div className="flex-1">
          <ProfileCard user={userData2} isDark={true} />
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.abs(userData1.followers - userData2.followers)}
          </div>
          <div className="text-sm text-gray-600">Followers Difference</div>
          <div className="text-xs text-gray-500 mt-1">
            {userData1.followers > userData2.followers ? 'User 1 leads' : 'User 2 leads'}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.abs(userData1.repos - userData2.repos)}
          </div>
          <div className="text-sm text-gray-600">Repos Difference</div>
          <div className="text-xs text-gray-500 mt-1">
            {userData1.repos > userData2.repos ? 'User 1 has more' : 'User 2 has more'}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.abs(userData1.following - userData2.following)}
          </div>
          <div className="text-sm text-gray-600">Following Difference</div>
          <div className="text-xs text-gray-500 mt-1">
            {userData1.following > userData2.following ? 'User 1 follows more' : 'User 2 follows more'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComparison;