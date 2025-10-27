// Calculate repository health score
export const calculateHealthScore = (repo, contributors = []) => {
  const scores = {
    activity: calculateActivityScore(repo),
    maintenance: calculateMaintenanceScore(repo),
    community: calculateCommunityScore(contributors),
    documentation: calculateDocumentationScore(repo)
  };

  const weights = {
    activity: 0.3,
    maintenance: 0.3,
    community: 0.25,
    documentation: 0.15
  };

  return Object.keys(scores).reduce((total, key) => {
    return total + (scores[key] * weights[key]);
  }, 0);
};

const calculateActivityScore = (repo) => {
  const daysSinceUpdate = Math.floor((new Date() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24));
  
  if (daysSinceUpdate < 7) return 1.0;
  if (daysSinceUpdate < 30) return 0.8;
  if (daysSinceUpdate < 90) return 0.6;
  if (daysSinceUpdate < 180) return 0.4;
  return 0.2;
};

const calculateMaintenanceScore = (repo) => {
  let score = 0.5; // Base score
  
  // Open issues ratio
  if (repo.open_issues_count > 0) {
    const issueRatio = repo.open_issues_count / (repo.stargazers_count || 1);
    score += issueRatio < 0.1 ? 0.3 : issueRatio < 0.3 ? 0.1 : -0.2;
  }
  
  // Has wiki
  if (repo.has_wiki) score += 0.1;
  
  // Has topics
  if (repo.topics && repo.topics.length > 0) score += 0.1;
  
  return Math.min(Math.max(score, 0), 1);
};

const calculateCommunityScore = (contributors) => {
  if (contributors.length === 0) return 0.3;
  
  const totalContributions = contributors.reduce((sum, contrib) => sum + contrib.contributions, 0);
  const topContributorShare = Math.max(...contributors.map(c => c.contributions)) / totalContributions;
  
  // Lower score if one contributor dominates
  if (topContributorShare > 0.8) return 0.4;
  if (topContributorShare > 0.6) return 0.6;
  if (contributors.length > 10) return 0.9;
  if (contributors.length > 5) return 0.8;
  return 0.7;
};

const calculateDocumentationScore = (repo) => {
  let score = 0.3; // Base score
  
  if (repo.description) score += 0.2;
  if (repo.homepage) score += 0.2;
  if (repo.readme) score += 0.3;
  
  return Math.min(score, 1);
};

// Technology stack analysis
export const analyzeTechStack = (languages) => {
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  return Object.entries(languages)
    .map(([language, bytes]) => ({
      language,
      percentage: (bytes / totalBytes) * 100,
      bytes
    }))
    .sort((a, b) => b.percentage - a.percentage);
};

// Trend analysis
export const calculateTrendScore = (repo) => {
  const daysSinceCreated = Math.floor((new Date() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24));
  const starsPerDay = repo.stargazers_count / daysSinceCreated;
  
  return starsPerDay * 100; // Normalized score
};