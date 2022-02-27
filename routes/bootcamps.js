const express = require('express');
const { getBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcampById,
    deleteBootcampById,
    getBootcampsInRadius } = require('../controllers/bootcamps');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route resource into respective router
router.use('/:bootcampId/courses', courseRouter );




router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/')
    .get(getBootcamps).post(createBootcamp);
router.route('/:id')
    .get(getBootcampById).put(updateBootcampById).delete(deleteBootcampById);

module.exports = router;
