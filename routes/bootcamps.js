const Bootcamp = require('../models/bootcamps');
const advancedResults  = require('../middlewares/advancedResults');
const { isAuthenticated } = require('../middlewares/auth');

const express = require('express');
const { getBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcampById,
    deleteBootcampById,
    getBootcampsInRadius,
    uploadBootcampPhoto } = require('../controllers/bootcamps');

// Construct resource router
const courseRouter = require('./courses')

// Bootcamp router
const router = express.Router();

// Re-route resource to courseRouter
router.use('/:bootcampId/courses', courseRouter );

// Photo-upload route
router.route('/:id/photos').put(uploadBootcampPhoto);

// Get bootcamps in radius route
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Get all bootcamps and create a single
router.route('/')
    .get(advancedResults(Bootcamp, 'Courses'), getBootcamps)
    .post(createBootcamp);

// Get, Update and Delete a bootcamp via id
router.route('/:id')
    .get(getBootcampById)
    .put(isAuthenticated ,updateBootcampById)
    .delete(deleteBootcampById);

module.exports = router;
