const Event = require('../models/supabase/Event');
const User = require('../models/supabase/User');
const { validationResult } = require('express-validator');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    let query = {};

    // Filter by status (only show approved events to public)
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'approved';
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Event type filter (online/offline/hybrid)
    if (req.query.eventType) {
      query.eventType = req.query.eventType;
    }

    // City filter
    if (req.query.city) {
      query['location.city'] = new RegExp(req.query.city, 'i');
    }

    // College filter
    if (req.query.college) {
      query['college.name'] = new RegExp(req.query.college, 'i');
    }

    // Date filter
    if (req.query.startDate) {
      query['date.start'] = { $gte: new Date(req.query.startDate) };
    }

    if (req.query.endDate) {
      query['date.start'] = { 
        ...query['date.start'],
        $lte: new Date(req.query.endDate) 
      };
    }

    // Upcoming events only
    if (req.query.upcoming === 'true') {
      query['date.start'] = { $gte: new Date() };
    }

    // Featured events
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Free events
    if (req.query.free === 'true') {
      query['registration.fee'] = 0;
    }

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Sorting
    let sortBy = { 'date.start': 1 }; // Default: upcoming first
    if (req.query.sort === 'latest') {
      sortBy = { createdAt: -1 };
    } else if (req.query.sort === 'popular') {
      sortBy = { views: -1 };
    } else if (req.query.sort === 'favorites') {
      sortBy = { favoritesCount: -1 };
    }

    const total = await Event.countDocuments(query);
    
    const events = await Event.find(query)
      .populate('organizer', 'name email avatar')
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar college');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Increment views
    event.views += 1;
    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
        errors: errors.array()
      });
    }

    // Add organizer to body
    req.body.organizer = req.user.id;

    // Set status based on user role
    if (req.user.role === 'admin') {
      req.body.status = 'approved';
    } else {
      req.body.status = 'pending';
    }

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' 
        ? 'Event created successfully' 
        : 'Event submitted for approval',
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
        message: 'Event not found'
      });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
        message: 'Event not found'
      });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle favorite event
// @route   POST /api/events/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const user = await User.findById(req.user.id);
    const favoriteIndex = user.favorites.indexOf(req.params.id);

    if (favoriteIndex > -1) {
      // Remove from favorites
      user.favorites.splice(favoriteIndex, 1);
      event.favoritesCount = Math.max(0, event.favoritesCount - 1);
    } else {
      // Add to favorites
      user.favorites.push(req.params.id);
      event.favoritesCount += 1;
    }

    await user.save();
    await event.save();

    res.status(200).json({
      success: true,
      isFavorite: favoriteIndex === -1,
      message: favoriteIndex > -1 ? 'Removed from favorites' : 'Added to favorites'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's favorite events
// @route   GET /api/events/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      populate: {
        path: 'organizer',
        select: 'name email avatar'
      }
    });

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's submitted events
// @route   GET /api/events/my-events
// @access  Private
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve/Reject event (Admin only)
// @route   PUT /api/events/:id/status
// @access  Private/Admin
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Event ${status}`,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get event categories with counts
// @route   GET /api/events/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Event.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
