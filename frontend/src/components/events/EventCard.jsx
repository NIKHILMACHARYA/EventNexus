import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { getCategoryIcon, getCategoryColor, formatDate, formatEventType } from '../../utils/helpers';
import { useState } from 'react';

const EventCard = ({ event }) => {
  const { isAuthenticated, user } = useAuth();
  const { toggleFavorite } = useEvents();
  const [isLoading, setIsLoading] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(false);

  // Handle both MongoDB (_id) and Supabase (id) formats
  const eventId = event.id || event._id;
  
  // Check if event is in user's favorites
  const isFavorite = localFavorite || user?.favorites?.some(fav => 
    (typeof fav === 'string' ? fav : fav.id || fav._id) === eventId
  );

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setIsLoading(true);
    try {
      const response = await toggleFavorite(eventId);
      setLocalFavorite(response.isFavorited);
      
      // Show success animation
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setIsLoading(false);
    }
  };

  const CategoryIcon = getCategoryIcon(event.category);
  const categoryColor = getCategoryColor(event.category);

  return (
    <Link to={`/events/${eventId}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary-500 to-secondary-500">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CategoryIcon className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
            {event.category.replace('-', ' ').toUpperCase()}
          </div>

          {/* Event Type Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-gray-700">
            {formatEventType(event.event_type || event.eventType)}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            className={`absolute bottom-3 right-3 p-2 rounded-full transition-all transform hover:scale-110 ${
              isFavorite 
                ? 'bg-yellow-400 text-white shadow-lg' 
                : 'bg-white/90 text-gray-600 hover:bg-yellow-400 hover:text-white'
            } ${isLoading ? 'animate-pulse' : ''}`}
          >
            <Star className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Featured Badge */}
          {event.featured && (
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
              ⭐ FEATURED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.shortDescription || (event.description?.substring(0, 100) + '...') || 'No description available'}
          </p>

          {/* Meta Info */}
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>{formatDate(event.date?.start || event.date)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className="truncate">{event.location?.city || event.city}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>{event.time?.start || 'TBA'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-sm text-gray-600">{event.college?.name || event.college}</span>
            </div>

            {(event.registration?.fee || event.registration_fee) > 0 ? (
              <span className="text-primary-600 font-bold">₹{event.registration?.fee || event.registration_fee}</span>
            ) : (
              <span className="text-green-600 font-bold">FREE</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
