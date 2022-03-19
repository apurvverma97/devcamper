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
    .get(getBootcamps)
    .post(createBootcamp);

// Get, Update and Delete a bootcamp vid id
router.route('/:id')
    .get(getBootcampById)
    .put(updateBootcampById)
    .delete(deleteBootcampById);

module.exports = router;
