import React, { useState, useEffect } from "react";
import RepoComparator from "../components/Comparison/RepoComparator";
import EnhancedGitHubProfileComparison from "../components/Comparison/EnhancedGitHubProfileComparison";

const Compare = ({ onNavigate, initialState }) => {
  console.log("Compare page rendered with props:", {
    onNavigate: !!onNavigate,
    initialState,
  });

  // Add this utility function at the top of the file
  const extractUsername = (input) => {
    if (!input) return "";

    // If it's already a username (no slashes), return as is
    if (!input.includes("/") && !input.includes(".")) {
      return input.trim();
    }

    // If it's a GitHub URL, extract the username
    const githubUrlMatch = input.match(/github\.com\/([^\/]+)/);
    if (githubUrlMatch) {
      return githubUrlMatch[1];
    }

    // If it's any other URL with a path, try to extract the last part
    const pathMatch = input.match(/\/([^\/]+)$/);
    if (pathMatch) {
      return pathMatch[1];
    }

    // Return the input as is if no patterns match
    return input.trim();
  };

  // Repository state
  const [repo1, setRepo1] = useState("");
  const [repo2, setRepo2] = useState("");
  const [repoComparisonData, setRepoComparisonData] = useState(null);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState("");

  // Profile state
  const [profile1, setProfile1] = useState("");
  const [profile2, setProfile2] = useState("");
  const [profileComparisonData, setProfileComparisonData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Check if data was passed from navigation
  useEffect(() => {
    if (initialState?.repo1) {
      console.log("Setting repo1 from initialState:", initialState.repo1);
      setRepo1(initialState.repo1);
    }
    if (initialState?.username1) {
      setProfile1(initialState.username1);
    }
  }, [initialState]);

  // Function to fetch repository data from GitHub API
  const fetchRepositoryData = async (repoFullName) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoFullName}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Repository "${repoFullName}" not found`);
        } else if (response.status === 403) {
          throw new Error("GitHub API rate limit exceeded. Please try again later.");
        } else {
          throw new Error(`Failed to fetch repository: ${response.statusText}`);
        }
      }
      
      const repoData = await response.json();
      return repoData;
    } catch (error) {
      console.error(`Error fetching repository ${repoFullName}:`, error);
      throw error;
    }
  };

  // Repository comparison handler - UPDATED WITH REAL API CALL
  const handleRepoCompare = async () => {
    if (!repo1 || !repo2) {
      setRepoError("Please enter both repository names");
      return;
    }

    setRepoLoading(true);
    setRepoError("");
    setRepoComparisonData(null);

    try {
      // Validate repository format (should be in owner/repo format)
      const repo1Valid = repo1.includes('/');
      const repo2Valid = repo2.includes('/');
      
      if (!repo1Valid || !repo2Valid) {
        setRepoError("Please use format: owner/repository-name (e.g., facebook/react)");
        return;
      }

      // Fetch both repositories data in parallel
      const [repo1Data, repo2Data] = await Promise.all([
        fetchRepositoryData(repo1),
        fetchRepositoryData(repo2)
      ]);

      setRepoComparisonData({
        repo1: repo1Data,
        repo2: repo2Data
      });

    } catch (error) {
      console.error("Repository comparison error:", error);
      setRepoError(error.message || "Failed to compare repositories. Please check the repository names and try again.");
    } finally {
      setRepoLoading(false);
    }
  };

  // Profile comparison handler
  const handleProfileCompare = async () => {
    const extractedUsername1 = extractUsername(profile1);
    const extractedUsername2 = extractUsername(profile2);

    if (!extractedUsername1 || !extractedUsername2) return;

    setProfileLoading(true);
    try {
      setProfileComparisonData({
        username1: extractedUsername1,
        username2: extractedUsername2,
      });
    } catch (error) {
      console.error("Profile comparison error:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Quick comparisons data
  const quickComparisons = {
    repositories: [
      {
        repo1: "facebook/react",
        repo2: "vuejs/vue",
        label: "React vs Vue",
        description: "Most popular frontend frameworks",
      },
      {
        repo1: "angular/angular",
        repo2: "sveltejs/svelte",
        label: "Angular vs Svelte",
        description: "Enterprise vs lightweight framework",
      },
      {
        repo1: "nodejs/node",
        repo2: "denoland/deno",
        label: "Node.js vs Deno",
        description: "JavaScript runtime comparison",
      },
    ],
    profiles: [
      {
        username1: "facebook",
        username2: "google",
        label: "Facebook vs Google",
        description: "Tech giant organizations",
      },
      {
        username1: "torvalds",
        username2: "gaearon",
        label: "Linus vs Dan",
        description: "Linux creator vs React core team",
      },
      {
        username1: "microsoft",
        username2: "apple",
        label: "Microsoft vs Apple",
        description: "Software vs Hardware giants",
      },
    ],
  };

  const handleQuickComparison = (type, item1, item2) => {
    if (type === "repositories") {
      setRepo1(item1);
      setRepo2(item2);
      // Auto-trigger comparison after a short delay
      setTimeout(() => {
        handleRepoCompare();
      }, 100);
    } else {
      setProfile1(item1);
      setProfile2(item2);
      // Auto-trigger comparison after a short delay
      setTimeout(() => {
        handleProfileCompare();
      }, 100);
    }
  };

  

  return (
    <div className="min-h-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center  mb-8">
          <h1 className="text-5xl  font-bold text-gray-900 ">
            GitHub Comparison Hub
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Compare GitHub repositories and developer profiles side-by-side with
            detailed analytics and insights
          </p>
        </div>

        {/* Main Comparison Container */}
        <div className="space-y-12">
          {/* Repository Comparison Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="bg-linear-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Repository Comparison

              </h2>
            </div>

            <div className="p-6">
              {/* Repository Input Forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Repository <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={repo1}
                    onChange={(e) => setRepo1(e.target.value)}
                    placeholder="facebook/react"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Format: owner/repository-name
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Second Repository <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={repo2}
                    onChange={(e) => setRepo2(e.target.value)}
                    placeholder="vuejs/vue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Format: owner/repository-name
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {repoError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700">{repoError}</span>
                  </div>
                </div>
              )}

              {/* Repository Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleRepoCompare}
                  disabled={repoLoading || !repo1 || !repo2}
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  {repoLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Comparing Repositories...
                    </div>
                  ) : (
                    "Compare Repositories"
                  )}
                </button>

                {/* Quick Repository Comparisons */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {quickComparisons.repositories.map((comparison, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleQuickComparison(
                            "repositories",
                            comparison.repo1,
                            comparison.repo2
                          )
                        }
                        className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 py-2 px-3 rounded border border-gray-300 hover:border-blue-300 transition-all duration-200 text-center truncate"
                        title={comparison.description}
                      >
                        {comparison.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Repository Comparison Results */}
              {repoComparisonData && (
                <RepoComparator
                  repo1={repoComparisonData.repo1}
                  repo2={repoComparisonData.repo2}
                />
              )}
            </div>
          </section>

          {/* Partitioning Line */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300 border-dashed"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-4 text-lg font-semibold text-gray-500">
                AND
              </span>
            </div>
          </div>

          {/* Profile Comparison Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="bg-linear-to-r from-green-500 to-teal-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile Comparison
              </h2>
            </div>

            <div className="p-6">
              {/* Profile Input Forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First GitHub Profile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile1}
                    onChange={(e) => setProfile1(e.target.value)}
                    placeholder="github-username OR https://github.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    GitHub username or organization name
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Second GitHub Profile{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile2}
                    onChange={(e) => setProfile2(e.target.value)}
                    placeholder="github-username OR https://github.com/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    GitHub username or organization name
                  </p>
                </div>
              </div>

              {/* Profile Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleProfileCompare}
                  disabled={profileLoading || !profile1 || !profile2}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  {profileLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Comparing Profiles...
                    </div>
                  ) : (
                    "Compare Profiles"
                  )}
                </button>

                {/* Quick Profile Comparisons */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {quickComparisons.profiles.map((comparison, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleQuickComparison(
                            "profiles",
                            comparison.username1,
                            comparison.username2
                          )
                        }
                        className="text-xs bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 py-2 px-3 rounded border border-gray-300 hover:border-green-300 transition-all duration-200 text-center truncate"
                        title={comparison.description}
                      >
                        {comparison.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Comparison Results */}
              {profileComparisonData && (
                <EnhancedGitHubProfileComparison
                  username1={profileComparisonData.username1}
                  username2={profileComparisonData.username2}
                />
              )}
            </div>
          </section>
        </div>

        {/* Features Overview */}
        {!repoComparisonData && !profileComparisonData && (
          <div className="mt-12 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              What You Can Compare
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    Repository Comparison
                  </h4>
                  
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Stars, forks, and contributor analysis
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Code activity and maintenance metrics
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Community engagement insights
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    Profile Comparison
                  </h4>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Followers, following, and repository counts
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Account longevity and activity patterns
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Community impact and influence
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;