import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink, 
  Heart,
  Share2,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Award,
  CheckCircle,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateRange, formatEventType, getCategoryColor, getDaysUntil, formatCurrency } from '../utils/helpers';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEvent, loading, error, fetchEvent, toggleFavorite } = useEvents();
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchEvent(id);
  }, [id]);

  useEffect(() => {
    if (currentEvent) {
      setIsFavorite(currentEvent.isFavorited || false);
    }
  }, [currentEvent]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await toggleFavorite(id);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentEvent.title,
        text: currentEvent.shortDescription || currentEvent.description.substring(0, 100),
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link to="/events" className="text-primary-600 font-medium hover:text-primary-700">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const event = currentEvent;

  // Generate Google Maps URL
  const getMapEmbedUrl = () => {
    const venue = event.venue || event.location?.venue || '';
    const city = event.city || event.location?.city || '';
    const address = event.location?.address || '';
    
    // Create full address
    const fullAddress = [venue, address, city].filter(Boolean).join(', ');
    
    if (fullAddress) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(fullAddress)}`;
    }
    return null;
  };

  const getDirectionsUrl = () => {
    const venue = event.venue || event.location?.venue || '';
    const city = event.city || event.location?.city || '';
    const address = event.location?.address || '';
    const fullAddress = [venue, address, city].filter(Boolean).join(', ');
    
    if (fullAddress) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary-600 to-secondary-600">
        {event.image && (
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleShare}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleFavorite}
            className={`p-3 rounded-lg transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              {/* Category & Type */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
                  {event.category.replace('-', ' ').toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                  {formatEventType(event.eventType)}
                </span>
                {event.featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                    ⭐ FEATURED
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organized by</p>
                  <p className="font-semibold text-gray-900">{event.college?.name}</p>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About This Event</h3>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
              </div>

              {/* Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule</h3>
                  <div className="space-y-3">
                    {event.schedule.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-primary-600 font-semibold min-w-24">{item.time}</div>
                        <div className="text-gray-700">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prizes */}
              {event.prizes && event.prizes.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Prizes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {event.prizes.map((prize, index) => (
                      <div key={index} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
                        <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-900">{prize.position}</div>
                        <div className="text-yellow-700 font-semibold">{prize.prize}</div>
                        {prize.amount > 0 && (
                          <div className="text-2xl font-bold text-gray-900 mt-1">
                            {formatCurrency(prize.amount)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-24">
              {/* Date */}
              <div className="flex items-start space-x-4 mb-4 pb-4 border-b">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDateRange(event.date?.start || event.date, event.date?.end || event.end_date)}
                  </p>
                  <p className="text-sm text-primary-600 font-medium">
                    {getDaysUntil(event.date?.start || event.date)}
                  </p>
                </div>
              </div>

              {/* Time */}
              {event.time?.start && (
                <div className="flex items-start space-x-4 mb-4 pb-4 border-b">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">
                      {event.time.start} {event.time.end && `- ${event.time.end}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-start space-x-4 mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{event.location?.venue || event.venue || event.location?.city || event.city}</p>
                    {event.location?.address && (
                      <p className="text-sm text-gray-600">{event.location.address}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {event.location?.city || event.city}{(event.location?.state || event.state) && `, ${event.location?.state || event.state}`}
                    </p>
                  </div>
                </div>
                
                {/* Google Maps Embed */}
                {getMapEmbedUrl() && (
                  <div className="mt-3">
                    <iframe
                      width="100%"
                      height="200"
                      style={{ border: 0, borderRadius: '8px' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={getMapEmbedUrl()}
                      className="shadow-sm"
                    ></iframe>
                    
                    {/* Get Directions Button */}
                    {getDirectionsUrl() && (
                      <a
                        href={getDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Get Directions</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Registration Fee */}
              <div className="flex items-start space-x-4 mb-6 pb-4 border-b">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Fee</p>
                  {(event.registration?.fee || event.registration_fee) > 0 ? (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(event.registration?.fee || event.registration_fee)}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-green-600">FREE</p>
                  )}
                </div>
              </div>

              {/* Register Button */}
              {(() => {
                const registrationLink = event.registration?.link || event.registration_link;
                if (registrationLink && registrationLink.trim() !== '') {
                  return (
                    <a
                      href={registrationLink.startsWith('http') ? registrationLink : `https://${registrationLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors mb-4"
                    >
                      <span>Register Now</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  );
                }
                return (
                  <button className="w-full bg-gray-300 text-gray-600 py-3 px-6 rounded-lg font-semibold cursor-not-allowed mb-4">
                    Registration Not Available
                  </button>
                );
              })()}

              {/* Registration Deadline */}
              {event.registrationDeadline && (
                <p className="text-sm text-center text-gray-500">
                  Register before: {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              )}

              {/* Contact Info */}
              {(event.contact?.email || event.contact?.phone || event.contact?.website) && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                  <div className="space-y-2">
                    {event.contact.email && (
                      <a href={`mailto:${event.contact.email}`} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{event.contact.email}</span>
                      </a>
                    )}
                    {event.contact.phone && (
                      <a href={`tel:${event.contact.phone}`} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{event.contact.phone}</span>
                      </a>
                    )}
                    {event.contact.website && (
                      <a href={event.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Visit Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
