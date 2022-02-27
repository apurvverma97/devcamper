const express = require('express');
const { getBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcampById,
    deleteBootcampById,
    getBootcampsInRadius } = require('../controllers/bootcamps');

// Construct resource router
const courseRouter = require('./courses')

// Bootcamp router
const router = express.Router();

// Re-route resource to courseRouter
router.use('/:bootcampId/courses', courseRouter );


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/')
    .get(getBootcamps).post(createBootcamp);
router.route('/:id')
    .get(getBootcampById).put(updateBootcampById).delete(deleteBootcampById);

module.exports = router;
