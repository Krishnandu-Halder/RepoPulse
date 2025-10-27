import axios from 'axios';

const GITHUB_API_BASE = import.meta.env.VITE_GITHUB_API_BASE || 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

console.log('GitHub API Config:', {
  baseURL: GITHUB_API_BASE,
  hasToken: !!GITHUB_TOKEN,
  tokenLength: GITHUB_TOKEN ? GITHUB_TOKEN.length : 0
});

// Create axios instance with base configuration
const githubAPI = axios.create({
  baseURL: GITHUB_API_BASE,
  timeout: 10000, // 10 second timeout
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : '',
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

// Add request interceptor for debugging
githubAPI.interceptors.request.use(
  (config) => {
    console.log('Making GitHub API request:', {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
githubAPI.interceptors.response.use(
  (response) => {
    console.log('GitHub API response received:', {
      url: response.config.url,
      status: response.status,
      rateLimit: response.headers['x-ratelimit-remaining']
    });
    return response;
  },
  (error) => {
    console.error('GitHub API response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Rate limiting helper
const checkRateLimit = (response) => {
  const remaining = response.headers['x-ratelimit-remaining'];
  const limit = response.headers['x-ratelimit-limit'];
  const resetTime = response.headers['x-ratelimit-reset'];
  
  console.log(`GitHub API Rate Limit: ${remaining}/${limit} requests remaining`);
  
  if (remaining && parseInt(remaining) < 10) {
    const resetDate = new Date(resetTime * 1000);
    console.warn(`Rate limit low: ${remaining} remaining. Resets at: ${resetDate.toLocaleString()}`);
  }
  
  return response;
};

// Enhanced error handling
const handleError = (error) => {
  console.error('GitHub API Error Details:', {
    code: error.code,
    message: error.message,
    responseStatus: error.response?.status,
    responseData: error.response?.data,
    configURL: error.config?.url
  });

  if (error.response) {
    // GitHub API error
    const status = error.response.status;
    const message = error.response.data?.message || 'GitHub API error';
    
    switch (status) {
      case 401:
        throw new Error('Invalid GitHub token. Please check your .env file and ensure VITE_GITHUB_TOKEN is set correctly.');
      case 403:
        if (error.response.headers['x-ratelimit-remaining'] === '0') {
          throw new Error('GitHub API rate limit exceeded. Please wait and try again.');
        }
        throw new Error('Access forbidden. Check your token permissions.');
      case 404:
        throw new Error('User or repository not found. Please check the username.');
      case 422:
        throw new Error('Invalid search query or parameters.');
      default:
        throw new Error(`GitHub API error: ${message} (Status: ${status})`);
    }
  } else if (error.request) {
    // Network error
    console.error('Network error details:', error.request);
    throw new Error('Network error: Could not connect to GitHub API. Check your internet connection and try again.');
  } else {
    // Request setup error
    throw new Error(`Request error: ${error.message}`);
  }
};

export const githubService = {
  // Get user details
  getUser: async (username) => {
    try {
      console.log(`Fetching user: ${username}`);
      const response = await githubAPI.get(`/users/${username}`);
      checkRateLimit(response);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Basic repository search
  searchRepositories: async (params) => {
    try {
      const response = await githubAPI.get('/search/repositories', { 
        params: {
          per_page: 30,
          ...params
        }
      });
      checkRateLimit(response);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get repository details
  getRepository: async (owner, repo) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}`);
      checkRateLimit(response);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get repository languages
  getRepositoryLanguages: async (owner, repo) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}/languages`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get contributors
  getContributors: async (owner, repo) => {
    try {
      const response = await githubAPI.get(`/repos/${owner}/${repo}/contributors`, {
        params: { per_page: 10 }
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get user's starred repositories
  getUserStarredRepos: async (username) => {
    try {
      const response = await githubAPI.get(`/users/${username}/starred`, {
        params: { per_page: 30 }
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};