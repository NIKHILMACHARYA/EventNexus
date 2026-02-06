import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { 
  Calendar, 
  Heart, 
  PlusCircle, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, getDaysUntil } from '../utils/helpers';
import { STATUS_COLORS } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const { myEvents, favorites, loading, fetchMyEvents, fetchFavorites } = useEvents();

  useEffect(() => {
    fetchMyEvents();
    fetchFavorites();
  }, []);

  const stats = [
    { 
      icon: Calendar, 
      label: 'Events Submitted', 
      value: myEvents.length,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      icon: Heart, 
      label: 'Favorites', 
      value: favorites.length,
      color: 'bg-red-100 text-red-600'
    },
    { 
      icon: CheckCircle, 
      label: 'Approved', 
      value: myEvents.filter(e => e.status === 'approved').length,
      color: 'bg-green-100 text-green-600'
    },
    { 
      icon: Clock, 
      label: 'Pending', 
      value: myEvents.filter(e => e.status === 'pending').length,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your events</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/create-event"
            className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all card-hover"
          >
            <PlusCircle className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Submit New Event</h3>
            <p className="text-primary-100 text-sm">Share your event with the community</p>
          </Link>

          <Link 
            to="/events"
            className="bg-white border-2 border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-all card-hover"
          >
            <Calendar className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Browse Events</h3>
            <p className="text-gray-600 text-sm">Discover new opportunities</p>
          </Link>

          <Link 
            to="/favorites"
            className="bg-white border-2 border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-all card-hover"
          >
            <Heart className="w-8 h-8 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Favorites</h3>
            <p className="text-gray-600 text-sm">View saved events</p>
          </Link>
        </div>

        {/* My Events */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
            <Link to="/create-event" className="text-primary-600 font-medium hover:text-primary-700">
              + Add Event
            </Link>
          </div>

          {myEvents.length > 0 ? (
            <div className="space-y-4">
              {myEvents.slice(0, 5).map((event) => (
                <Link
                  key={event.id || event._id}
                  to={`/events/${event.id || event._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[event.status]}`}>
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.date?.start || event.date)}</span>
                        </span>
                        <span>{event.location?.city || event.city}</span>
                        <span>{event.views} views</span>
                      </div>
                    </div>
                    {getStatusIcon(event.status)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No events yet</h3>
              <p className="text-gray-500 mb-4">Start by submitting your first event!</p>
              <Link 
                to="/create-event"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Submit Event</span>
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Favorite Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Favorites</h2>
            <Link to="/favorites" className="text-primary-600 font-medium hover:text-primary-700">
              View All
            </Link>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.slice(0, 4).map((event) => (
                <Link
                  key={event.id || event._id}
                  to={`/events/${event.id || event._id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{formatDate(event.date?.start || event.date)}</span>
                    <span className="text-primary-600 font-medium">{getDaysUntil(event.date?.start || event.date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No favorite events yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
