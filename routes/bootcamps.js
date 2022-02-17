const express = require('express');
const { getBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcampById,
    deleteBootcampById,
    getBootcampsInRadius } = require('../controllers/bootcamps');

const router = express.Router();


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/')
    .get(getBootcamps).post(createBootcamp);
router.route('/:id')
    .get(getBootcampById).put(updateBootcampById).delete(deleteBootcampById);

module.exports = router;
