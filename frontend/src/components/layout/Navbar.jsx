import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as notificationService from '../../services/notificationService';
import { 
  Menu, 
  X, 
  Calendar, 
  User, 
  LogOut, 
  Star, 
  PlusCircle,
  LayoutDashboard,
  ChevronDown,
  Shield,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch unread notification count
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">CampusEvents</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/events" 
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Browse Events
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/create-event" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Event</span>
                </Link>
                <Link 
                  to="/favorites" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>Favorites</span>
                </Link>
                
                {/* Notifications Bell */}
                <Link 
                  to="/notifications" 
                  className="relative flex items-center group"
                >
                  <div className={`relative ${unreadCount > 0 ? 'animate-bell-ring' : ''}`}>
                    <Bell 
                      className={`w-5 h-5 transition-colors ${
                        unreadCount > 0 
                          ? 'text-red-600 fill-red-100' 
                          : 'text-gray-600 group-hover:text-primary-600'
                      }`} 
                    />
                    {unreadCount > 0 && (
                      <>
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                      </>
                    )}
                  </div>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                  >
                    <div className={`w-8 h-8 ${user?.role === 'admin' ? 'bg-red-100' : 'bg-primary-100'} rounded-full flex items-center justify-center`}>
                      {user?.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-red-600" />
                      ) : (
                        <User className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <span className={user?.role === 'admin' ? 'text-red-600 font-semibold' : ''}>
                      {user?.name?.split(' ')[0]}
                      {user?.role === 'admin' && ' (Admin)'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 animate-fadeIn">
                      {user?.role === 'admin' && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 font-semibold"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                          <hr className="my-2" />
                        </>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/events" 
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-primary-600 font-medium"
              >
                Browse Events
              </Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Link 
                    to="/notifications" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-primary-600 font-medium flex items-center space-x-2 relative"
                  >
                    <div className={`relative ${unreadCount > 0 ? 'animate-bell-ring' : ''}`}>
                      <Bell 
                        className={`w-5 h-5 ${unreadCount > 0 ? 'text-red-600 fill-red-100' : ''}`} 
                      />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
                  </Link>
                  <Link 
                    to="/create-event" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-primary-600 font-medium"
                  >
                    Submit Event
                  </Link>
                  <Link 
                    to="/favorites" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-primary-600 font-medium"
                  >
                    Favorites
                  </Link>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-primary-600 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-primary-600 font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-red-600 font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-primary-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsOpen(false)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
