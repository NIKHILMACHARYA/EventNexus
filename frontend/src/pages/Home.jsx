import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight,
  Code,
  Trophy,
  BookOpen,
  Laptop,
  Music,
  Mic
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import EventCardSkeleton from '../components/common/EventCardSkeleton';
import { CATEGORIES } from '../utils/constants';

const Home = () => {
  const { events, loading, fetchEvents } = useEvents();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents({ limit: 6, upcoming: 'true', featured: 'true' });
  }, []);

  useEffect(() => {
    setFeaturedEvents(events.slice(0, 6));
  }, [events]);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
  };

  const stats = [
    { icon: Calendar, value: '500+', label: 'Events Listed' },
    { icon: Users, value: '50K+', label: 'Students' },
    { icon: MapPin, value: '100+', label: 'Colleges' },
    { icon: Trophy, value: '₹1Cr+', label: 'Prize Pool' }
  ];

  const categoryIcons = {
    'hackathon': Laptop,
    'coding-contest': Code,
    'workshop': BookOpen,
    'seminar': Mic,
    'tech-talk': Mic,
    'cultural': Music
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fadeIn">
              Discover Amazing
              <span className="block text-yellow-300">College Events</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fadeIn">
              Your gateway to hackathons, coding contests, workshops, and campus events. 
              Never miss an opportunity to learn, compete, and grow!
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-fadeIn">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hackathons, workshops, coding contests..."
                  className="w-full pl-12 pr-32 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 animate-fadeIn">
              <Link to="/events?category=hackathon" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                🚀 Hackathons
              </Link>
              <Link to="/events?category=coding-contest" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                💻 Coding Contests
              </Link>
              <Link to="/events?category=workshop" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                📚 Workshops
              </Link>
              <Link to="/events?eventType=online" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                🌐 Online Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-3">
                  <stat.icon className="w-7 h-7 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the perfect event that matches your interests and goals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.slice(0, 6).map((category) => {
              const Icon = categoryIcons[category.value] || Calendar;
              return (
                <Link
                  key={category.value}
                  to={`/events?category=${category.value}`}
                  className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all card-hover"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-3">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {category.label.split(' ')[1] || category.label.split(' ')[0]}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Upcoming Events
              </h2>
              <p className="text-gray-600">Don't miss these exciting opportunities</p>
            </div>
            <Link 
              to="/events" 
              className="hidden md:flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id || event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Check back later for upcoming events!</p>
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link 
              to="/events" 
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have an Event to Share?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Help fellow students discover amazing opportunities. Submit your college event 
            and reach thousands of students across the country!
          </p>
          <Link 
            to="/create-event"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <span>Submit Your Event</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
