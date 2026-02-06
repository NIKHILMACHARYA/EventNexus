const Event = require('../models/supabase/Event');
const User = require('../models/supabase/User');
const Notification = require('../models/supabase/Notification');
const { validationResult } = require('express-validator');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const filters = {
      status: req.user?.role === 'admin' ? req.query.status : 'approved',
      category: req.query.category,
      eventType: req.query.eventType,
      city: req.query.city,
      college: req.query.college,
      search: req.query.search,
      upcoming: req.query.upcoming,
      sortBy: req.query.sort || 'date',
      sortOrder: req.query.order || 'asc',
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await Event.findAll(filters);

    res.status(200).json({
      success: true,
      count: result.events.length,
      total: result.pagination.total,
      totalPages: result.pagination.pages,
      currentPage: result.pagination.page,
      data: result.events,
    });
  } catch (error) {
    console.error('Error in getEvents:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Only admins and event creators can view non-approved events
    if (
      event.status !== 'approved' &&
      (!req.user ||
        (req.user.id !== event.organizer_id && req.user.role !== 'admin'))
    ) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Increment views
    await Event.incrementViews(req.params.id);

    // Check if favorited by current user
    let isFavorited = false;
    if (req.user) {
      isFavorited = await User.isFavorited(req.user.id, req.params.id);
    }

    res.status(200).json({
      success: true,
      data: { ...event, isFavorited },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    console.log('Creating event with data:', JSON.stringify(req.body, null, 2));

    // Transform nested data structure to flat database columns
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      event_type: req.body.eventType || 'offline',
      image: req.body.image,
      
      // Date fields - use start date as main date, end_date for end
      date: req.body.date?.start,
      end_date: req.body.date?.end,
      registration_deadline: req.body.registrationDeadline,
      
      // Location fields - flatten the location object
      venue: req.body.location?.venue,
      city: req.body.location?.city,
      
      // College field - flatten college object
      college: req.body.college?.name,
      
      // Registration fields - flatten registration object
      registration_link: req.body.registration?.link || req.body.contact?.website,
      registration_fee: req.body.registration?.fee || 0,
      
      // Arrays
      tags: req.body.tags || [],
      requirements: req.body.requirements || [],
      
      // Set organizer
      organizer_id: req.user.id,
      organizer: req.user.name,
    };

    // Auto-approve for admins, pending for others
    if (req.user.role === 'admin') {
      eventData.status = 'approved';
    } else {
      eventData.status = 'pending';
    }

    console.log('Transformed event data:', JSON.stringify(eventData, null, 2));

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error in createEvent:', error);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('Request body:', req.body);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Make sure user is event owner or admin
    if (
      event.organizer_id !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Transform nested data structure to flat database columns (same as create)
    const updateData = {};
    
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.eventType) updateData.event_type = req.body.eventType;
    if (req.body.image) updateData.image = req.body.image;
    
    // Date fields
    if (req.body.date?.start) updateData.date = req.body.date.start;
    if (req.body.date?.end) updateData.end_date = req.body.date.end;
    if (req.body.registrationDeadline) updateData.registration_deadline = req.body.registrationDeadline;
    
    // Location fields
    if (req.body.location?.venue) updateData.venue = req.body.location.venue;
    if (req.body.location?.city) updateData.city = req.body.location.city;
    
    // College field
    if (req.body.college?.name) updateData.college = req.body.college.name;
    
    // Registration fields
    if (req.body.registration?.link) updateData.registration_link = req.body.registration.link;
    if (req.body.registration?.fee !== undefined) updateData.registration_fee = req.body.registration.fee;
    if (req.body.contact?.website) updateData.registration_link = req.body.contact.website;
    
    // Arrays
    if (req.body.tags) updateData.tags = req.body.tags;
    if (req.body.requirements) updateData.requirements = req.body.requirements;

    event = await Event.update(req.params.id, updateData);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Make sure user is event owner or admin
    if (
      event.organizer_id !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await Event.delete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Toggle favorite
// @route   POST /api/events/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const isFavorited = await User.isFavorited(req.user.id, req.params.id);

    let message;
    if (isFavorited) {
      await User.removeFavorite(req.user.id, req.params.id);
      message = 'Event removed from favorites';
    } else {
      await User.addFavorite(req.user.id, req.params.id);
      message = 'Event added to favorites';
    }

    res.status(200).json({
      success: true,
      message,
      isFavorited: !isFavorited,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user's favorite events
// @route   GET /api/events/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await User.getFavorites(req.user.id);

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user's own events
// @route   GET /api/events/my-events
// @access  Private
exports.getMyEvents = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await Event.findByOrganizer(req.user.id, filters);

    res.status(200).json({
      success: true,
      count: result.events.length,
      total: result.pagination.total,
      totalPages: result.pagination.pages,
      currentPage: result.pagination.page,
      data: result.events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update event status (approve/reject)
// @route   PUT /api/events/:id/status
// @access  Private/Admin
exports.updateEventStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!['approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Update event status
    const updatedEvent = await Event.update(req.params.id, { status });

    // Create notification for event organizer
    let notificationMessage = '';
    let notificationType = 'info';

    if (status === 'approved') {
      notificationMessage = `🎉 Great news! Your event "${event.title}" has been approved and is now live!`;
      notificationType = 'success';
    } else if (status === 'rejected') {
      notificationMessage = `❌ Your event "${event.title}" has been rejected.${reason ? ` Reason: ${reason}` : ''}`;
      notificationType = 'error';
    } else if (status === 'cancelled') {
      notificationMessage = `⚠️ Your event "${event.title}" has been cancelled.${reason ? ` Reason: ${reason}` : ''}`;
      notificationType = 'warning';
    }

    // Send notification to event organizer
    console.log('Creating notification for organizer:', event.organizer_id);
    console.log('Notification data:', {
      user_id: event.organizer_id,
      type: notificationType,
      title: `Event ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: notificationMessage,
      link: `/events/${event.id}`,
    });
    
    const notification = await Notification.create({
      user_id: event.organizer_id,
      type: notificationType,
      title: `Event ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: notificationMessage,
      link: `/events/${event.id}`,
      is_read: false,
    });
    
    console.log('Notification created successfully:', notification);

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: `Event ${status} successfully and notification sent to organizer`,
    });
  } catch (error) {
    console.error('Error in updateEventStatus:', error);
    console.error('Error message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get event categories
// @route   GET /api/events/categories/list
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Event.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
