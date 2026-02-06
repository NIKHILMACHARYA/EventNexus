import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import EventCardSkeleton from '../components/common/EventCardSkeleton';

const Favorites = () => {
  const { favorites, loading, fetchFavorites } = useEvents();

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500" />
            <span>Your Favorites</span>
          </h1>
          <p className="text-gray-600 mt-1">Events you've saved for later</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((event) => (
              <EventCard key={event.id || event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              Start exploring events and save the ones you like!
            </p>
            <Link 
              to="/events"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
            >
              <Calendar className="w-5 h-5" />
              <span>Browse Events</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
