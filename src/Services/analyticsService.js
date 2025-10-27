import { calculateHealthScore, analyzeTechStack } from '../utils/analyticsCalculations';

export const analyticsService = {
  generateRepositoryReport: async (repo, contributors, languages) => {
    const healthScore = calculateHealthScore(repo, contributors);
    const techStack = analyzeTechStack(languages);
    
    return {
      health: {
        score: healthScore,
        level: getHealthLevel(healthScore),
        description: getHealthDescription(healthScore)
      },
      techStack,
      recommendations: generateRecommendations(repo, healthScore, techStack)
    };
  },

  compareRepositories: (repo1, repo2, analytics1, analytics2) => {
    return {
      popularity: comparePopularity(repo1, repo2),
      activity: compareActivity(repo1, repo2),
      community: compareCommunity(repo1, repo2, analytics1, analytics2),
      maintenance: compareMaintenance(repo1, repo2)
    };
  }
};

const getHealthLevel = (score) => {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Fair';
  return 'Poor';
};

const getHealthDescription = (score) => {
  if (score >= 0.8) return 'Well-maintained with active community';
  if (score >= 0.6) return 'Regularly updated with good documentation';
  if (score >= 0.4) return 'Limited activity, consider alternatives';
  return 'Not actively maintained';
};

const comparePopularity = (repo1, repo2) => {
  const score1 = (repo1.stargazers_count + repo1.forks_count * 2) / 3;
  const score2 = (repo2.stargazers_count + repo2.forks_count * 2) / 3;
  
  return {
    winner: score1 > score2 ? 'repo1' : 'repo2',
    difference: Math.abs(score1 - score2)
  };
};