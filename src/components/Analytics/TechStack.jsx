import React from 'react';
import { analyzeTechStack } from '../../utils/analyticsCalculations';

const TechStack = ({ languages }) => {
  const techStack = analyzeTechStack(languages);
  
  if (!techStack || techStack.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
        <p className="text-gray-500 text-center py-4">No language data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
      
      {/* Main Language */}
      {techStack[0] && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-900">Primary Language</span>
            <span className="text-2xl font-bold text-blue-600">
              {techStack[0].language}
            </span>
          </div>
          <div className="mt-2 text-sm text-blue-700">
            {techStack[0].percentage.toFixed(1)}% of codebase
          </div>
        </div>
      )}

      {/* All Languages */}
      <div className="space-y-3">
        {techStack.slice(0, 6).map((tech, index) => (
          <div key={tech.language} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-medium text-gray-700">{tech.language}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${tech.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {tech.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {techStack.length > 6 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          +{techStack.length - 6} more languages
        </div>
      )}
    </div>
  );
};

export default TechStack;