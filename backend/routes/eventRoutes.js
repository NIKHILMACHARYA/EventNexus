const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleFavorite,
  getFavorites,
  getMyEvents,
  updateEventStatus,
  getCategories
} = require('../controllers/eventController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Validation rules
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date.start').optional().notEmpty().withMessage('Start date is required'),
  body('location.city').optional().trim().notEmpty().withMessage('City is required'),
  body('college.name').optional().trim().notEmpty().withMessage('College/Organization name is required')
];

// Public routes
router.get('/', optionalAuth, getEvents);
router.get('/categories', getCategories);
router.get('/favorites', protect, getFavorites);
router.get('/my-events', protect, getMyEvents);
router.get('/:id', optionalAuth, getEvent);

// Protected routes
router.post('/', protect, eventValidation, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/favorite', protect, toggleFavorite);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updateEventStatus);

module.exports = router;
