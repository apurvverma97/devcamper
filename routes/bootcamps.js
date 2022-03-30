const Bootcamp = require('../models/bootcamps');
const advancedResults  = require('../middlewares/advancedResults');
const { isAuthenticated,
        isAuthorized } = require('../middlewares/auth');

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

router.use('/:bootcampId/courses', courseRouter );
// Re-route resource to courseRouter

// Photo-upload route
router.route('/:id/photos').put(isAuthenticated, isAuthorized('publisher', 'admin'), uploadBootcampPhoto);

// Get bootcamps in radius route
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Get all bootcamps and create a single
router.route('/')
    .get(advancedResults(Bootcamp, 'Courses'), getBootcamps)
    .post(isAuthenticated,isAuthorized('publisher', 'admin'),createBootcamp);

// Get, Update and Delete a bootcamp via id
router.route('/:id')
    .get(getBootcampById)
    .put(isAuthenticated, isAuthorized('publisher', 'admin'), updateBootcampById)
    .delete(isAuthenticated, isAuthorized('publisher', 'admin'), deleteBootcampById);

module.exports = router;
