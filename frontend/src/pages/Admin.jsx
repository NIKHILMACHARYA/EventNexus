import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import * as eventService from '../services/eventService';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, Users, AlertCircle, MessageSquare } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchPendingEvents();
  }, [user, navigate]);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents({ status: 'pending' });
      setPendingEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (eventId, status, reason = '') => {
    try {
      setProcessing(eventId);
      await eventService.updateEventStatus(eventId, status, reason);
      
      // Remove from pending list
      setPendingEvents(prev => prev.filter(event => event.id !== eventId));
      
      if (status === 'approved') {
        toast.success('✅ Event approved successfully! Event is now live on the browse page.');
      } else {
        toast.success('Event rejected. Organizer has been notified.');
      }
      
      // Close modal if open
      setShowRejectModal(false);
      setSelectedEvent(null);
      setRejectionReason('');
      
      // Refresh pending events list
      await fetchPendingEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error(error.response?.data?.message || 'Failed to update event status');
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (event) => {
    setSelectedEvent(event);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedEvent(null);
    setRejectionReason('');
  };

  const handleRejectSubmit = () => {
    if (selectedEvent) {
      handleApproval(selectedEvent.id, 'rejected', rejectionReason);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Review and approve pending events</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Events</p>
                <p className="text-3xl font-bold text-orange-600">{pendingEvents.length}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <p className="text-3xl font-bold text-blue-600">Admin</p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="text-lg font-bold text-gray-900">{user.name}</p>
              </div>
              <Users className="w-12 h-12 text-gray-400 opacity-20" />
            </div>
          </div>
        </div>

        {/* Pending Events */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pendingEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">There are no pending events to review at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                          Pending Approval
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {event.category}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Date & Time</p>
                        <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">{event.venue || event.city}</p>
                        <p className="text-sm text-gray-500">{event.college}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Registration</p>
                        <p className="text-sm text-gray-600">
                          {event.registration_fee === 0 ? 'Free' : `₹${event.registration_fee}`}
                        </p>
                        {event.max_participants && (
                          <p className="text-sm text-gray-500">
                            Max: {event.max_participants} participants
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApproval(event.id, 'approved')}
                      disabled={processing === event.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {processing === event.id ? 'Processing...' : 'Approve Event'}
                    </button>

                    <button
                      onClick={() => openRejectModal(event)}
                      disabled={processing === event.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      {processing === event.id ? 'Processing...' : 'Reject Event'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">Reject Event</h3>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Are you sure you want to reject "<strong>{selectedEvent.title}</strong>"?
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (Optional)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Let the organizer know why their event was rejected..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows="4"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This reason will be sent to the event organizer via notification.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeRejectModal}
                    disabled={processing === selectedEvent.id}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={processing === selectedEvent.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold"
                  >
                    {processing === selectedEvent.id ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
