import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, GitBranch, TrendingUp, Users, Star } from 'lucide-react';

const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Simulate real-time notifications
  useEffect(() => {
    // Initial notifications
    const initialNotifications = [
      {
        id: 1,
        type: 'trending',
        title: '🔥 Trending Repository',
        message: 'React just reached 220k stars!',
        time: '2 min ago',
        read: false,
        link: '/search?query=react',
        icon: TrendingUp,
        color: 'text-orange-500'
      },
      {
        id: 2,
        type: 'comparison',
        title: '📊 Comparison Ready',
        message: 'Your React vs Vue analysis is complete',
        time: '5 min ago',
        read: false,
        link: '/compare?repo1=facebook/react&repo2=vuejs/vue',
        icon: GitBranch,
        color: 'text-blue-500'
      },
      {
        id: 3,
        type: 'community',
        title: '👥 New Contributors',
        message: 'TypeScript gained 15 new contributors this week',
        time: '1 hour ago',
        read: false,
        link: '/analytics?repo=microsoft/TypeScript',
        icon: Users,
        color: 'text-green-500'
      },
      {
        id: 4,
        type: 'achievement',
        title: '⭐ Milestone Reached',
        message: 'You analyzed 10+ repositories this week',
        time: '2 hours ago',
        read: true,
        link: '/dashboard',
        icon: Star,
        color: 'text-yellow-500'
      }
    ];

    setNotifications(initialNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: ['trending', 'comparison', 'community', 'achievement'][Math.floor(Math.random() * 4)],
        title: ['🔥 Hot Repository', '📈 Growth Alert', '👥 Community Update', '🎯 Recommendation'][Math.floor(Math.random() * 4)],
        message: [
          'Next.js trending with 5k new stars this week',
          'New popular framework detected in your searches',
          'Your compared repositories have new updates',
          'Similar repositories found based on your interests'
        ][Math.floor(Math.random() * 4)],
        time: 'Just now',
        read: false,
        link: '/search?query=trending',
        icon: [TrendingUp, GitBranch, Users, Star][Math.floor(Math.random() * 4)],
        color: ['text-orange-500', 'text-blue-500', 'text-green-500', 'text-yellow-500'][Math.floor(Math.random() * 4)]
      };

      setNotifications(prev => [newNotification, ...prev]);
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Handle navigation based on notification type and link
    if (notification.link) {
      // Extract page and parameters from the link
      const url = new URL(notification.link, window.location.origin);
      const path = url.pathname;
      const params = new URLSearchParams(url.search);
      
      // You can integrate this with your navigation system
      console.log('Navigation triggered:', { path, params: Object.fromEntries(params) });
      
      // Example: Trigger navigation to search with query
      if (path === '/search' && params.get('query')) {
        // This would integrate with your existing navigation
        window.dispatchEvent(new CustomEvent('navigateToPage', {
          detail: {
            page: 'search',
            state: { searchQuery: params.get('query') }
          }
        }));
      }
      
      // Close notification menu
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (notification) => {
    const Icon = notification.icon || Bell;
    return <Icon className={`w-4 h-4 ${notification.color || 'text-gray-500'}`} />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>No notifications</p>
                <p className="text-sm">Notifications will appear here</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-medium text-sm ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-green-600 hover:text-green-800 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                        {notification.link && (
                          <span className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                            View details →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with quick actions */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">
                  {unreadCount} unread of {notifications.length}
                </span>
                <button
                  onClick={() => {
                    // Navigate to notifications page (you can create this)
                    console.log('Navigate to all notifications');
                    setIsOpen(false);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;