import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from './components/Layouts/Header';
import Sidebar from './components/Layouts/Sidebar';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Compare from './pages/Compare';
import Analytics from './pages/Analytics';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageState, setPageState] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoaded } = useUser();

  // Handle notification navigation
  useEffect(() => {
    const handleNotificationNavigation = (event) => {
      const { page, state } = event.detail;
      navigateTo(page, state);
    };

    window.addEventListener('navigateToPage', handleNotificationNavigation);

    return () => {
      window.removeEventListener('navigateToPage', handleNotificationNavigation);
    };
  }, []);

  const navigateTo = (pageId, state = {}) => {
    console.log(`Navigating to: ${pageId}`, state);
    setCurrentPage(pageId);
    setPageState(state);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    const props = {
      onNavigate: navigateTo,
      initialState: pageState
    };

    console.log(`Rendering page: ${currentPage} with props:`, props);

    switch (currentPage) {
      case 'search':
        return <Search {...props} />;
      case 'compare':
        return <Compare {...props} />;
      case 'analytics':
        return <Analytics {...props} />;
      case 'dashboard':
      default:
        return <Dashboard {...props} />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GitHub Explorer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed position */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentPage={currentPage}
          onNavigate={navigateTo}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            currentPage={currentPage}
            onNavigate={navigateTo}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-0 lg:ml-1">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;