import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, AlertCircle } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import EventCardSkeleton from '../components/common/EventCardSkeleton';

const Events = () => {
  const [searchParams] = useSearchParams();
  const { events, loading, error, pagination, fetchEvents, filters, setFilters } = useEvents();
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    eventType: searchParams.get('eventType') || '',
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    upcoming: 'true',
    sort: 'date'
  });

  useEffect(() => {
    // Fetch events with URL params on mount
    fetchEvents(localFilters);
  }, []);

  const handleSearch = () => {
    fetchEvents(localFilters);
  };

  const handlePageChange = (page) => {
    fetchEvents({ ...localFilters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Browse Events
          </h1>
          <p className="text-gray-600">
            Discover hackathons, coding contests, workshops, and more
          </p>
        </div>

        {/* Filters */}
        <EventFilters 
          filters={localFilters} 
          setFilters={setLocalFilters}
          onSearch={handleSearch}
        />

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-gray-600">
            Found <span className="font-semibold text-gray-900">{pagination.total}</span> events
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id || event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            pagination.currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === pagination.currentPage - 2 ||
                      page === pagination.currentPage + 2
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setLocalFilters({
                  category: '',
                  eventType: '',
                  city: '',
                  search: '',
                  upcoming: 'true',
                  sort: 'date'
                });
                fetchEvents({ upcoming: 'true' });
              }}
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
