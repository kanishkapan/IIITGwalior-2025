import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { api } from './../../axios.config.js';

const Notibell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications from MongoDB
  const fetchNotifications = async () => {
    try {
      // Using your backend endpoint structure
      const response = await api.get('/notifications');
      
      // Handle the response structure from your backend
      if (response.data.success) {
        setNotifications(response.data.notifications);
        
        // Count unread notifications
        const unread = response.data.notifications.filter(notif => !notif.isRead).length;
        setUnreadCount(unread);
      } else {
        console.error('Error in response:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read locally (since we don't have the PATCH endpoint)
  const markAsRead = (id) => {
    // Only update the UI state without making API call
    setNotifications(notifications.map(notif => 
      notif._id === id ? { ...notif, isRead: true } : notif
    ));
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    
    // If opening dropdown, fetch latest notifications
    if (!isOpen) {
      fetchNotifications();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling every minute
    const interval = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Format notification timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'message':
        return '✉️';
      case 'alert':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <div className="relative cursor-pointer" onClick={toggleDropdown}>
        <Bell className="w-6 h-6 text-gray-400 hover:text-gray-600" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  className="text-sm text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    // Mark all as read locally since we don't have the API endpoint
                    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
                    setUnreadCount(0);
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li 
                  key={notification._id} 
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <div className="p-2 text-center border-t border-gray-100">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notibell;